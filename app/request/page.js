import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function RequestPage() {
  return (
    <div className="mt-40 w-[80vw] flex flex-col gap-5 text-justify mx-auto">
      <h1 className="text-4xl  font-bold">Заявка на удаление контента!</h1>
      <p>
        Если вы являетесь правообладателем и вам требуется отозвать ваш контент,
        пожалуйста, отправьте заявку на удаление контента. Чтобы мы могли
        оперативно рассмотреть ваш запрос, убедитесь, что заявка содержит всю
        указанную ниже информацию. Без этой информации обработка запроса может
        быть затруднена.
      </p>
      <ol className="flex flex-col gap-5">
        <li className="text-base">
          <h1 className="text-2xl font-bold">1. Контактная информация</h1>
          <p>
            Укажите ваши актуальные контактные данные, чтобы мы могли связаться
            с вами для уточнения информации. Пример:
          </p>
          <ul className="list-disc ml-10">
            <li>Электронная почта</li>
            <li>Номер телефона</li>
          </ul>
        </li>

        <li className="text-base">
          <h1 className="text-2xl font-bold">
            2. Описание защищенного материала
          </h1>
          <p>
            Дайте четкое и подробное описание работы, права на которую были
            нарушены. Если нарушение касается нескольких материалов, можно
            указать только ключевые из них.
          </p>
        </li>

        <li className="text-base">
          <h1 className="text-2xl font-bold">
            3. Ссылки на материалы, нарушающие авторские права
          </h1>
          <p>
            Предоставьте точные URL-адреса всех видеоматериалов, которые, по
            вашему мнению, нарушают ваши права. Это поможет нам быстро найти и
            удалить соответствующий контент.
          </p>
          <p>Формат ссылок:</p>

          <ul className="list-disc ml-10">
            <li>lingofilm.ru/films/[slug]</li>
            <li>lingofilm.ru/series/[slug]</li>
            <li>lingofilm.ru/cartoons/[slug]</li>
          </ul>
        </li>

        <li className="text-base">
          <h1 className="text-2xl font-bold">
            4. Заявление о добросовестности
          </h1>
          <p>
            &quot;Я добросовестно полагаю, что использование указанных
            материалов указанным способом не разрешено правообладателем, его
            представителем или законодательством. Информация в данном
            уведомлении является точной, и я, под страхом наказания за
            лжесвидетельство, заявляю, что являюсь владельцем или уполномоченным
            представителем владельца исключительных прав, которые
            предположительно были нарушены.&quot;
          </p>
        </li>

        <li className="text-base">
          <h1 className="text-2xl font-bold">5. Заверение заяки</h1>
          <p>Заверьте свою жалобу подписью. Это может быть:</p>
          <ul className="list-disc ml-10">
            <li>Собственноручная подпись</li>
            <li>Электронная подпись</li>
            <li>
              Полное имя (если заявление отправляется по электронной почте)
            </li>
          </ul>
        </li>
      </ol>
      <i>
        После подготовки всех данных отправьте вашу заявку на адрес:
        <span className="font-base font-normal rounded bg-green-500 p-1 mx-1 text-black">
          copyright@lingofilm.ru
        </span>
        Мы гарантируем, что все обращения будут рассмотрены оперативно и с
        должным вниманием. Спасибо за ваше сотрудничество!
      </i>
      <div className="flex flex-row gap-5 ">
        <Link href={"/#header"}>
          <Button className={"bg-green-500 text-black"}>
            Вернуться на главную
          </Button>
        </Link>
        <Link href={"/copyright#header"}>
          <Button>Информация правообладателям</Button>
        </Link>
      </div>
    </div>
  );
}
