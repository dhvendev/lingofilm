import { Button } from "../ui/button";
import { Slider } from "../ui/slider";
import { Volume2, VolumeOff } from "lucide-react";

export default function VolumeControl({ volume, isMuted, onVolumeChange, toggleMute }) {
	const handleVolumeSliderChange = (values) => {
		const [newVolume] = values;
		onVolumeChange(newVolume);
	};

	return (
		<div className="flex items-center relative" >
			<Button
				onClick={(e) => {
					e.stopPropagation();
					toggleMute();
				}}
				className="bg-transparent hover:bg-white hover:bg-opacity-20 text-white rounded-full p-2"
				variant="ghost"
				size="icon"
			>
				{isMuted || volume === 0 ? (<VolumeOff size={30}/>) : (<Volume2 size={30}/>)}
			</Button>
			
			<div className={`w-20`}>
				<Slider
					value={[isMuted ? 0 : volume]}
					min={0}
					max={100}
					step={1}
					onValueChange={handleVolumeSliderChange}
				/>
			</div>
		</div>
	);
}