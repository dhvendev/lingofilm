	"use client";

	import { useState, useEffect, useRef } from "react";
	import { Button } from "./ui/button";
	import { Slider } from "./ui/slider";
	import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	} from "./ui/dropdown-menu";
	import Hls from "hls.js";
	import {
	Pause,
	Play,
	SkipBack,
	SkipForward,
	Volume2,
	VolumeX,
	Maximize,
	Minimize,
	X,
	Settings,
	Subtitles,
	} from "lucide-react";
import ProgressBar from "./Player/ProgressBar";

	export default function Player() {
	// URLs для видео и субтитров
	const src =
	"https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/480/movie.m3u8";
	const rus_sub =
	"https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/subtitles/rus.srt";
	const eng_sub =
	"https://s3.lingofilm.ru/films/harry-potter-and-the-deathly-hallows-part-1-2010/subtitles/eng.srt";

	// Состояния плеера
	const [isPlaying, setIsPlaying] = useState(false);
	const [isFullScreen, setIsFullScreen] = useState(false);
	const [currentTime, setCurrentTime] = useState(0);
	const [duration, setDuration] = useState(0);
	const [showPlayer, setShowPlayer] = useState(false);
	const [quality, setQuality] = useState("480");
	const [volume, setVolume] = useState(100);
	const [isMuted, setIsMuted] = useState(false);
	const [showControls, setShowControls] = useState(true);
	const [subtitles, setSubtitles] = useState({
	rus: false,
	eng: false,
	dual: false,
	});
	const [isHlsLoaded, setIsHlsLoaded] = useState(false);
	// Состояния для меню
	const [openQualityMenu, setOpenQualityMenu] = useState(false);
	const [openSubtitleMenu, setOpenSubtitleMenu] = useState(false);
	// Новое состояние для текущих субтитров
	const [currentSubtitles, setCurrentSubtitles] = useState({
	rus: [],
	eng: [],
	});

	// Refs
	const videoRef = useRef(null);
	const playerContainerRef = useRef(null);
	const controlsRef = useRef(null);
	const hlsRef = useRef(null);
	const controlsTimeoutRef = useRef(null);
	const lastMouseMoveRef = useRef(0);
	const rusSubtitleRef = useRef(null);
	const engSubtitleRef = useRef(null);

	// Автоскрытие панели управления
	useEffect(() => {
	if (!showPlayer) return;

	const handleMouseMove = () => {
		lastMouseMoveRef.current = Date.now();
		
		if (!showControls) {
		setShowControls(true);
		}
		
		// Сбрасываем текущий таймаут
		if (controlsTimeoutRef.current) {
		clearTimeout(controlsTimeoutRef.current);
		}
		
		// Устанавливаем новый таймаут
		controlsTimeoutRef.current = setTimeout(() => {
		// Проверяем, прошло ли 3 секунды с последнего движения мыши
		if (Date.now() - lastMouseMoveRef.current >= 3000 && isPlaying) {
			setShowControls(false);
		}
		}, 3000);
	};

	const handleMouseLeave = () => {
		if (isPlaying && showControls) {
		controlsTimeoutRef.current = setTimeout(() => {
			setShowControls(false);
		}, 3000);
		}
	};

	// Сбрасываем таймаут когда воспроизведение остановлено
	if (!isPlaying) {
		setShowControls(true);
		if (controlsTimeoutRef.current) {
		clearTimeout(controlsTimeoutRef.current);
		}
	}

	const playerContainer = playerContainerRef.current;
	if (playerContainer) {
		playerContainer.addEventListener("mousemove", handleMouseMove);
		playerContainer.addEventListener("mouseleave", handleMouseLeave);
	}

	return () => {
		if (controlsTimeoutRef.current) {
		clearTimeout(controlsTimeoutRef.current);
		}
		if (playerContainer) {
		playerContainer.removeEventListener("mousemove", handleMouseMove);
		playerContainer.removeEventListener("mouseleave", handleMouseLeave);
		}
	};
	}, [showPlayer, isPlaying, showControls]);

	// Инициализация HLS после монтирования компонента
	useEffect(() => {
	if (!showPlayer || !videoRef.current) return;

	const video = videoRef.current;
	let hls = null;

	const initializeHls = () => {
		try {
		if (Hls.isSupported()) {
			// Уничтожаем существующий экземпляр hls, если он существует
			if (hlsRef.current) {
			hlsRef.current.destroy();
			}

			hls = new Hls({
			debug: false,
			enableWorker: true,
			lowLatencyMode: true,
			backBufferLength: 90,
			});

			hlsRef.current = hls;

			const videoSrc = src.replace("480", quality);

			// Устанавливаем обработчики событий
			hls.on(Hls.Events.MEDIA_ATTACHED, () => {
			console.log("HLS Media attached");
			hls.loadSource(videoSrc);
			});

			hls.on(Hls.Events.MANIFEST_PARSED, () => {
			console.log("HLS Manifest parsed");
			setIsHlsLoaded(true);
			if (isPlaying && video.paused) {
				video
				.play()
				.catch((err) => console.error("Error playing video:", err));
			}
			});

			hls.on(Hls.Events.ERROR, (event, data) => {
			if (data.fatal) {
				switch (data.type) {
				case Hls.ErrorTypes.NETWORK_ERROR:
					console.error("HLS network error:", data);
					hls.startLoad();
					break;
				case Hls.ErrorTypes.MEDIA_ERROR:
					console.error("HLS media error:", data);
					hls.recoverMediaError();
					break;
				default:
					console.error("HLS fatal error:", data);
					hls.destroy();
					initializeHls();
					break;
				}
			} else {
				console.warn("HLS non-fatal error:", data);
			}
			});

			// Прикрепляем медиа-элемент
			hls.attachMedia(video);
		} else if (video.canPlayType("application/vnd.apple.mpegurl")) {
			// Нативная поддержка HLS для Safari
			video.src = src.replace("480", quality);
			video.addEventListener("loadedmetadata", () => {
			setIsHlsLoaded(true);
			if (isPlaying) {
				video
				.play()
				.catch((err) => console.error("Error playing video:", err));
			}
			});
		} else {
			console.error("HLS is not supported in this browser");
		}
		} catch (error) {
		console.error("Error initializing HLS:", error);
		}
	};

	initializeHls();

	// Очистка при размонтировании
	return () => {
		if (hls) {
		hls.destroy();
		}
	};
	}, [showPlayer, quality, src, isPlaying]);

	// Обработка клавиатурных кнопок
	useEffect(() => {
	if (!showPlayer) return;

	const handleKeyDown = (e) => {
		const video = videoRef.current;
		if (!video) return;

		switch (e.key) {
		case " ":
			// Пробел - пауза/плей
			togglePlay();
			e.preventDefault();
			break;
		case "ArrowRight":
			// Стрелка вправо - перемотка вперед на 15 сек
			video.currentTime = Math.min(video.currentTime + 15, video.duration);
			e.preventDefault();
			break;
		case "ArrowLeft":
			// Стрелка влево - перемотка назад на 15 сек
			video.currentTime = Math.max(video.currentTime - 15, 0);
			e.preventDefault();
			break;
		case "m":
			// M - отключение/включение звука
			toggleMute();
			e.preventDefault();
			break;
		case "f":
			// F - полноэкранный режим
			toggleFullScreen();
			e.preventDefault();
			break;
		case "ArrowUp":
			// Стрелка вверх - увеличение громкости
			setVolume(Math.min(volume + 5, 100));
			if (isMuted) setIsMuted(false);
			e.preventDefault();
			break;
		case "ArrowDown":
			// Стрелка вниз - уменьшение громкости
			setVolume(Math.max(volume - 5, 0));
			e.preventDefault();
			break;
		default:
			break;
		}
	};

	document.addEventListener("keydown", handleKeyDown);
	return () => {
		document.removeEventListener("keydown", handleKeyDown);
	};
	}, [showPlayer, volume, isMuted, isPlaying]);

	// Функция для парсинга SRT файлов
	const parseSRT = async (url) => {
	try {
		const response = await fetch(url);
		const text = await response.text();

		// Разделяем по двойным новым строкам для получения блоков субтитров
		const blocks = text.trim().split(/\r?\n\r?\n/);
		const subtitles = [];

		for (const block of blocks) {
		const lines = block.split(/\r?\n/);
		if (lines.length < 3) continue;

		// Получаем времена
		const timeLine = lines[1];
		const timeMatch = timeLine.match(
			/(\d{2}:\d{2}:\d{2},\d{3}) --> (\d{2}:\d{2}:\d{2},\d{3})/
		);
		if (!timeMatch) continue;

		// Преобразуем времена в секунды
		const startTime = timeToSeconds(timeMatch[1]);
		const endTime = timeToSeconds(timeMatch[2]);

		// Получаем текст субтитров (все остальные строки)
		const subtitleText = lines.slice(2).join(" ");

		subtitles.push({
			id: parseInt(lines[0], 10),
			start: startTime,
			end: endTime,
			text: subtitleText,
		});
		}

		return subtitles;
	} catch (error) {
		console.error("Error parsing subtitles:", error);
		return [];
	}
	};

	// Конвертация времени из формата ЧЧ:ММ:СС,МСС в секунды
	const timeToSeconds = (timeString) => {
	const [time, milliseconds] = timeString.split(",");
	const [hours, minutes, seconds] = time.split(":").map(Number);
	return (
		hours * 3600 + minutes * 60 + seconds + parseInt(milliseconds, 10) / 1000
	);
	};

	// Загрузка субтитров при изменении настроек
	useEffect(() => {
	if (!showPlayer || !isHlsLoaded) return;

	const loadSubtitles = async () => {
		try {
		// Загружаем русские субтитры, если они нужны
		if (subtitles.rus || subtitles.dual) {
			const rusSubtitles = await parseSRT(rus_sub);
			setCurrentSubtitles((prev) => ({ ...prev, rus: rusSubtitles }));
		}

		// Загружаем английские субтитры, если они нужны
		if (subtitles.eng || subtitles.dual) {
			const engSubtitles = await parseSRT(eng_sub);
			setCurrentSubtitles((prev) => ({ ...prev, eng: engSubtitles }));
		}
		} catch (error) {
		console.error("Error loading subtitles:", error);
		}
	};

	loadSubtitles();
	}, [subtitles, showPlayer, isHlsLoaded, rus_sub, eng_sub]);

	// Отображение текущих субтитров в зависимости от времени видео
	useEffect(() => {
	if (!videoRef.current || !showPlayer) return;

	// Обновляем отображаемые субтитры по текущему времени видео
	const updateSubtitles = () => {
		const currentTime = videoRef.current.currentTime;

		// Очищаем предыдущие субтитры
		if (rusSubtitleRef.current) {
		rusSubtitleRef.current.innerHTML = "";
		}

		if (engSubtitleRef.current) {
		engSubtitleRef.current.innerHTML = "";
		}

		// Находим и отображаем текущие русские субтитры
		if ((subtitles.rus || subtitles.dual) && rusSubtitleRef.current) {
		const currentRusSub = currentSubtitles.rus.find(
			(sub) => currentTime >= sub.start && currentTime <= sub.end
		);

		if (currentRusSub) {
			// Разбиваем текст на слова для интерактивности
			const words = currentRusSub.text.split(" ");
			const htmlContent = words
			.map(
				(word) =>
				`<span class="subtitle-word" onclick="console.log('Русское слово: ${word.replace(
					/[.,!?;:]/g,
					""
				)}')">
					${word}
				</span>`
			)
			.join(" ");

			rusSubtitleRef.current.innerHTML = htmlContent;
		}
		}

		// Находим и отображаем текущие английские субтитры
		if ((subtitles.eng || subtitles.dual) && engSubtitleRef.current) {
		const currentEngSub = currentSubtitles.eng.find(
			(sub) => currentTime >= sub.start && currentTime <= sub.end
		);

		if (currentEngSub) {
			// Разбиваем текст на слова для интерактивности
			const words = currentEngSub.text.split(" ");
			const htmlContent = words
			.map(
				(word) =>
				`<span class="subtitle-word" onclick="console.log('English word: ${word.replace(
					/[.,!?;:]/g,
					""
				)}')">
					${word}
				</span>`
			)
			.join(" ");

			engSubtitleRef.current.innerHTML = htmlContent;
		}
		}
	};

	// Обновляем субтитры каждые 100мс
	const intervalId = setInterval(updateSubtitles, 100);

	return () => {
		clearInterval(intervalId);
	};
	}, [currentSubtitles, currentTime, subtitles, showPlayer]);

	// Обработчики событий для плеера
	useEffect(() => {
		const video = videoRef.current;
		if (!video || !showPlayer) return;

		const handleTimeUpdate = () => {
			setCurrentTime(video.currentTime);
		};

		const handleLoadedMetadata = () => {
			setDuration(video.duration || 0);
		};

		const handleEnded = () => {
			setIsPlaying(false);
		};

		const handlePlay = () => {
			setIsPlaying(true);
		};

		const handlePause = () => {
			setIsPlaying(false);
		};

		const handleFullscreenChange = () => {
			setIsFullScreen(!!document.fullscreenElement);
		};

		const handleVolumeChange = () => {
			setVolume(video.volume * 100);
			setIsMuted(video.muted);
		};

		video.addEventListener("timeupdate", handleTimeUpdate);
		video.addEventListener("loadedmetadata", handleLoadedMetadata);
		video.addEventListener("ended", handleEnded);
		video.addEventListener("play", handlePlay);
		video.addEventListener("pause", handlePause);
		video.addEventListener("volumechange", handleVolumeChange);
		document.addEventListener("fullscreenchange", handleFullscreenChange);

		return () => {
			video.removeEventListener("timeupdate", handleTimeUpdate);
			video.removeEventListener("loadedmetadata", handleLoadedMetadata);
			video.removeEventListener("ended", handleEnded);
			video.removeEventListener("play", handlePlay);
			video.removeEventListener("pause", handlePause);
			video.removeEventListener("volumechange", handleVolumeChange);
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, [showPlayer]);

	// Добавим более надежную обработку кликов по словам
	useEffect(() => {
	if (!showPlayer) return;

	const handleSubtitleWordClick = (event) => {
		// Проверяем, является ли целевой элемент словом в субтитрах
		if (event.target.classList.contains("subtitle-word")) {
		const word = event.target.textContent.trim().replace(/[.,!?;:]/g, "");
		console.log(`Clicked word: ${word}`);

		// Здесь можно будет добавить логику для отображения перевода
		// Например, открытие модального окна с переводом
		}
	};

	// Добавляем обработчик к контейнеру
	document.addEventListener("click", handleSubtitleWordClick);

	return () => {
		document.removeEventListener("click", handleSubtitleWordClick);
	};
	}, [showPlayer]);

	// Применение громкости к видео
	useEffect(() => {
	if (!videoRef.current) return;

	const video = videoRef.current;
	video.volume = volume / 100;
	video.muted = isMuted;
	}, [volume, isMuted]);

	// Обработчик изменения качества видео
	const handleQualityChange = (newQuality) => {
	if (quality === newQuality) return;

	try {
		const video = videoRef.current;
		if (!video) return;

		const currentTime = video.currentTime;
		const wasPlaying = !video.paused;

		setQuality(newQuality);
		setIsHlsLoaded(false);

		// Сохраняем текущее время для восстановления после смены качества
		video.addEventListener(
		"loadedmetadata",
		function onceLoaded() {
			video.removeEventListener("loadedmetadata", onceLoaded);
			video.currentTime = currentTime;
			if (wasPlaying) {
			video
				.play()
				.catch((err) => console.error("Error resuming playback:", err));
			}
		},
		{ once: true }
		);

		// Закрываем меню после выбора
		setOpenQualityMenu(false);
	} catch (error) {
		console.error("Error changing quality:", error);
	}
	};

	// Обработчик изменения субтитров
	const handleSubtitlesChange = (type) => {
	try {
		if (type === "rus") {
		setSubtitles({ rus: !subtitles.rus, eng: subtitles.eng, dual: false });
		} else if (type === "eng") {
		setSubtitles({ rus: subtitles.rus, eng: !subtitles.eng, dual: false });
		} else if (type === "dual") {
		setSubtitles({ rus: true, eng: true, dual: !subtitles.dual });
		} else if (type === "none") {
		setSubtitles({ rus: false, eng: false, dual: false });
		}

		// Не закрываем меню после выбора, чтобы пользователь мог сделать несколько выборов
	} catch (error) {
		console.error("Error changing subtitles:", error);
	}
	};

	// Воспроизведение/пауза
	const togglePlay = () => {
		try {
			const video = videoRef.current;
			if (!video) return;

			if (isPlaying) {
				video.pause();
			} else {
				video.play().catch((err) => console.error("Error playing video:", err));
			}
		} catch (error) {
			console.error("Error toggling play state:", error);
		}
	};

	// Включение/выключение звука
	const toggleMute = () => {
		setIsMuted(!isMuted);
	};

	// Перемотка на указанное количество секунд
	const seekTime = (seconds) => {
	try {
		const video = videoRef.current;
		if (!video) return;
		
		const newTime = Math.max(0, Math.min(video.duration, video.currentTime + seconds));
		video.currentTime = newTime;
	} catch (error) {
		console.error("Error seeking:", error);
	}
	};

	// Полноэкранный режим
	const toggleFullScreen = () => {
	try {
		const container = playerContainerRef.current;
		if (!container) return;

		if (!isFullScreen) {
		if (container.requestFullscreen) {
			container
			.requestFullscreen()
			.catch((err) => console.error("Error entering fullscreen:", err));
		} else if (container.webkitRequestFullscreen) {
			container.webkitRequestFullscreen();
		} else if (container.msRequestFullscreen) {
			container.msRequestFullscreen();
		}
		} else {
		if (document.exitFullscreen) {
			document
			.exitFullscreen()
			.catch((err) => console.error("Error exiting fullscreen:", err));
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		} else if (document.msExitFullscreen) {
			document.msExitFullscreen();
		}
		}
	} catch (error) {
		console.error("Error toggling fullscreen:", error);
	}
	};

	

	// Обработчик изменения громкости
	const handleVolumeChange = (values) => {
	try {
		const [newVolume] = values;
		setVolume(newVolume);
		if (newVolume > 0 && isMuted) {
		setIsMuted(false);
		}
	} catch (error) {
		console.error("Error changing volume:", error);
	}
	};

	// Открытие плеера
	const openPlayer = () => {
	setShowPlayer(true);
	};

	// Закрытие плеера
	const closePlayer = () => {
	try {
		setShowPlayer(false);
		setIsPlaying(false);
		setIsHlsLoaded(false);

		if (videoRef.current) {
		videoRef.current.pause();
		}

		if (hlsRef.current) {
		hlsRef.current.destroy();
		hlsRef.current = null;
		}

		// Очищаем субтитры
		setCurrentSubtitles({ rus: [], eng: [] });
	} catch (error) {
		console.error("Error closing player:", error);
	}
	};
	useEffect(() => {
		if (!openQualityMenu) return;
		
		const handleClickOutside = (event) => {
		  const isClickInsideQualityMenu = event.target.closest('.quality-menu-container');
		  if (!isClickInsideQualityMenu) {
			setOpenQualityMenu(false);
		  }
		};
		
		document.addEventListener('mousedown', handleClickOutside);
		return () => {
		  document.removeEventListener('mousedown', handleClickOutside);
		};
	  }, [openQualityMenu]);

	// Форматирование времени (секунды -> MM:SS)
	const formatTime = (time) => {
	if (!time || isNaN(time)) return "00:00";

	const minutes = Math.floor(time / 60);
	const seconds = Math.floor(time % 60);
	return `${minutes.toString().padStart(2, "0")}:${seconds
		.toString()
		.padStart(2, "0")}`;
	};

	// Добавьте этот useEffect в ваш компонент
	useEffect(() => {
	if (!openSubtitleMenu) return;

	const handleClickOutside = (event) => {
		const isClickInsideSubtitleMenu = event.target.closest('.subtitle-menu-container');
		if (!isClickInsideSubtitleMenu) {
		setOpenSubtitleMenu(false);
		}
	};

	document.addEventListener('mousedown', handleClickOutside);
	return () => {
		document.removeEventListener('mousedown', handleClickOutside);
	};
	}, [openSubtitleMenu]);

	return (
	<>
		{!showPlayer ? (
		<Button variant="default" className="primary1 rounded" onClick={openPlayer}>
		Смотреть
	  </Button>
		) : (
		<div
	ref={playerContainerRef}
	className="fixed inset-0 bg-black z-50 flex flex-col cursor-default"
	style={{ cursor: showControls ? "default" : "none" }}
	>
	<div className="relative w-full h-full flex flex-col"> {/* Изменено на flex-col */}
	<video
		ref={videoRef}
		className="absolute inset-0 w-full h-full"
		playsInline
		crossOrigin="anonymous"
		onClick={togglePlay}
	></video>

			{/* Контейнеры для субтитров */}
			{(subtitles.rus || subtitles.dual) && (
				<div
				ref={rusSubtitleRef}
				className={`absolute ${
					subtitles.dual ? "top-8" : "bottom-24"
				} left-0 right-0 text-center px-4 text-2xl text-white font-semibold bg-black bg-opacity-30 p-2 subtitle-container`}
				style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.8)" }}
				></div>
			)}

			{(subtitles.eng || subtitles.dual) && (
				<div
				ref={engSubtitleRef}
				className="absolute bottom-24 left-0 right-0 text-center px-4 text-2xl text-white font-semibold bg-black bg-opacity-30 p-2 subtitle-container"
				style={{ textShadow: "2px 2px 2px rgba(0,0,0,0.8)" }}
				></div>
			)}

			{/* Кнопки перемотки, которые появляются посередине экрана при нажатии */}
			<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-16 opacity-0 transition-opacity duration-300 pointer-events-none">
				<Button
				onClick={(e) => {
					e.stopPropagation();
					seekTime(-15);
				}}
				className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3"
				>
				<SkipBack size={24} />
				</Button>
				<Button
				onClick={(e) => {
					e.stopPropagation();
					seekTime(15);
				}}
				className="bg-black bg-opacity-50 hover:bg-opacity-70 text-white rounded-full p-3"
				>
				<SkipForward size={24} />
				</Button>
			</div>

			{/* Верхняя панель управления (заголовок и кнопка закрытия) */}
			<div 
				className={`absolute top-0 left-0 right-0 bg-gradient-to-b from-black to-transparent p-4 transition-opacity duration-300 ${
				showControls ? "opacity-100" : "opacity-0 pointer-events-none"
				}`}
				onClick={(e) => e.stopPropagation()}
			>
				<div className="flex justify-between items-center">
				<span className="text-white text-lg font-semibold">Harry Potter and the Deathly Hallows</span>
				<Button
					onClick={closePlayer}
					className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2"
					variant="ghost"
				>
					<X size={24} />
				</Button>
				</div>
			</div>

			{/* Контрольная панель (нижняя) */}
			<div
		ref={controlsRef}
		className={`relative mt-auto bg-gradient-to-t from-black to-transparent text-white p-4 transition-opacity duration-300 ${
		showControls ? "opacity-100" : "opacity-0 pointer-events-none"
		}`}
		onClick={(e) => e.stopPropagation()}
		style={{ zIndex: 50 }}
	>
				{/* Прогресс бар */}
				<div className="mb-4">
					<ProgressBar videoRef={videoRef} duration={duration} currentTime={currentTime}/>
				</div>
				
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-2">
						{/* Кнопка воспроизведения/паузы */}
						<Button
						onClick={togglePlay}
						className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
						variant="ghost"
						size="icon"
						>
						{isPlaying ? (
							<Pause size={20} />
						) : (
							<Play size={20} />
						)}
						</Button>
						
						{/* Кнопки перемотки */}
						<Button
						onClick={() => seekTime(-15)}
						className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
						variant="ghost"
						size="icon"
						>
						<SkipBack size={20} />
						</Button>
						<Button
						onClick={() => seekTime(15)}
						className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
						variant="ghost"
						size="icon"
						>
						<SkipForward size={20} />
						</Button>
						
						{/* Время */}
						<div className="text-sm">
						{formatTime(currentTime)} / {formatTime(duration)}
						</div>
					</div>
				
				<div className="flex items-center space-x-2">
					{/* Кнопка субтитров */}
					{/* Кнопка субтитров - альтернативный подход */}
					<div className="relative subtitle-menu-container">
  <Button
    onClick={() => setOpenSubtitleMenu(!openSubtitleMenu)}
    className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
    variant="ghost"
    size="icon"
  >
    <Subtitles size={20} />
  </Button>
  
  {openSubtitleMenu && (
    <div 
      className="absolute bottom-full right-0 mb-2 bg-zinc-800 text-white border border-zinc-700 rounded shadow-lg z-50 subtitle-menu-container"
      style={{ minWidth: '120px' }}
    >
      <div 
        className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.rus ? "bg-zinc-700" : ""}`}
        onClick={() => handleSubtitlesChange("rus")}
      >
        Русские
      </div>
      <div 
        className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.eng ? "bg-zinc-700" : ""}`}
        onClick={() => handleSubtitlesChange("eng")}
      >
        English
      </div>
      <div 
        className={`px-3 py-2 cursor-pointer hover:bg-zinc-700 ${subtitles.dual ? "bg-zinc-700" : ""}`}
        onClick={() => handleSubtitlesChange("dual")}
      >
        Dual
      </div>
      <div 
        className="px-3 py-2 cursor-pointer hover:bg-zinc-700"
        onClick={() => handleSubtitlesChange("none")}
      >
        Off
      </div>
    </div>
  )}
</div>
					
					{/* Качество видео */}
					<DropdownMenu open={openQualityMenu} onOpenChange={setOpenQualityMenu}>
					<DropdownMenuTrigger asChild>
						<Button
						className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
						variant="ghost"
						size="icon"
						>
						<Settings size={20} />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="bg-zinc-800 text-white border-zinc-700">
						<DropdownMenuItem 
						className={`cursor-pointer ${quality === "1080" ? "bg-zinc-700" : ""}`}
						onClick={() => handleQualityChange("1080")}
						>
						1080p
						</DropdownMenuItem>
						<DropdownMenuItem 
						className={`cursor-pointer ${quality === "720" ? "bg-zinc-700" : ""}`}
						onClick={() => handleQualityChange("720")}
						>
						720p
						</DropdownMenuItem>
						<DropdownMenuItem 
						className={`cursor-pointer ${quality === "480" ? "bg-zinc-700" : ""}`}
						onClick={() => handleQualityChange("480")}
						>
						480p
						</DropdownMenuItem>
						<DropdownMenuItem 
						className={`cursor-pointer ${quality === "360" ? "bg-zinc-700" : ""}`}
						onClick={() => handleQualityChange("360")}
						>
						360p
						</DropdownMenuItem>
					</DropdownMenuContent>
					</DropdownMenu>
					
					{/* Управление звуком */}
					<div className="flex items-center">
					<Button
						onClick={toggleMute}
						className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
						variant="ghost"
						size="icon"
					>
						{isMuted || volume === 0 ? (
						<VolumeX size={20} />
						) : (
						<Volume2 size={20} />
						)}
					</Button>
					<div className="w-20">
						<Slider
						value={[volume]}
						min={0}
						max={100}
						step={1}
						onValueChange={handleVolumeChange}
						className="h-1"
						/>
					</div>
					</div>
					
					{/* Кнопка полноэкранного режима */}
					<Button
					onClick={toggleFullScreen}
					className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
					variant="ghost"
					size="icon"
					>
					{isFullScreen ? (
						<Minimize size={20} />
					) : (
						<Maximize size={20} />
					)}
					</Button>
				</div>
				</div>
			</div>
			</div>
		</div>
		)}
	</>
	);
	}


// export default function ProgressBar({videoRef, duration, currentTime}) {
// 	const [isDragging, setIsDragging] = useState(false);
// 	const [tempSeekPosition, setTempSeekPosition] = useState(0);

// 	const handleDragChange = (values) => {
//         const [seekPosition] = values;
//         setTempSeekPosition(seekPosition);
// 	};

// 	const handleDragStart = () => {
// 	    setIsDragging(true);
// 	};

// 	const handleDragEnd = () => {
// 	try {
// 		const video = videoRef.current;
// 		if (!video || !duration) return;
// 		// Применяем перемотку только при окончании перетаскивания
// 		video.currentTime = (tempSeekPosition / 100) * duration;
// 		setIsDragging(false);
// 	} catch (error) {
// 		console.error("Error seeking:", error);
// 	}
// 	};

// 	const displayPosition = isDragging 
// 	? tempSeekPosition 
// 	: (duration ? (currentTime / duration) * 100 : 0);

//     return (
//         <>
//             <Slider
//                 value={[displayPosition]}
//                 min={0}
//                 max={100}
//                 step={0.1}
//                 onValueChange={handleDragChange}
//                 onValueCommit={handleDragEnd}
//                 onPointerDown={handleDragStart}
//                 className="w-full h-1"
//             />
//         </>
//     )
// }