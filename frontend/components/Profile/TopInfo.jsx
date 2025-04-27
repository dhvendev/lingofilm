import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Camera } from 'lucide-react'
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,    
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
    } from "@/components/ui/alert-dialog"
import { editPicture } from '@/services/axiosMethods';
import { toast } from "sonner"

export default function TopInfo({user, onUserUpdate}) {
    const [isOpen, setIsOpen] = useState(false);

    const [selectedAvatar, setSelectedAvatar] = useState(0);
    const avatarBackgrounds = ['ffdfbf', 'ffd5dc', 'd1d4f9', 'c0aede', 'b6e3f4', 'ffdfbf', 'ffd5dc', 'd1d4f9', 'c0aede', 'b6e3f4', 'ffdfbf', 'ffd5dc'];
    const [randomSeed, setRandomSeed] = useState(Math.random().toString(36).substring(2, 8));
    const [avatarUrl, setAvatarUrl] = useState(user.image);
    
    const generateAvatarUrl = (seed, bgIndex) => {
        const fixedSeed = `${seed}-avatar-${bgIndex}-${randomSeed}`;
        return `https://api.dicebear.com/9.x/personas/svg?seed=${fixedSeed}&radius=5&eyes=happy&facialHair[]&hair=cap,bobBangs,bobCut,curly,curlyBun,curlyHighTop,extraLong,shortComboverChops,pigtails&mouth=pacifier,smile,smirk,bigSmile&nose=mediumRound,smallRound&backgroundColor=${avatarBackgrounds[bgIndex || 0]}`;
    };

    const setNewAvatar = async() => {
      try {
        const newAvatarUrl = generateAvatarUrl(user.username, selectedAvatar);
        const res = await editPicture(newAvatarUrl)
        setAvatarUrl(newAvatarUrl);

        const updatedUser = {...user, image: newAvatarUrl};
        if (onUserUpdate) {
            onUserUpdate(updatedUser);
        }
        setIsOpen(false);
        toast.success("Аватар успешно изменен.");
      } catch (error) {
        toast.error(error.message || "Произошла ошибка при изменении аватара.");
      }
    }

    return (
        <>
            <div className="h-48 w-full bg-gradient-to-r from-green-500 to-blue-500 rounded-t-lg"></div>
                <div className="absolute bottom-4 left-8">
                    <Avatar className="h-24 w-24 border-4 border-black rounded-lg bg-black">
                        <AvatarImage src={avatarUrl} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                </div>
            <div className="absolute bottom-4 right-4">
            <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
              <AlertDialogTrigger asChild>
                <Button variant="outline" className="bg-black text-white hover:bg-gray-800">
                  <Camera className="h-4 w-4 mr-2" />Изменить фото
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-md">
                <AlertDialogHeader>
                  <AlertDialogTitle>Редактирование изображения профиля</AlertDialogTitle>
                  <AlertDialogDescription>
                    Выберите вариант аватара, который вам нравится:
                  </AlertDialogDescription>
                </AlertDialogHeader>
                
                <div className="grid grid-cols-4 gap-3 my-4">
                  {avatarBackgrounds.map((bg, index) => (
                    <div 
                      key={index} 
                      className={`h-22 w-22 cursor-pointer p-1 rounded-lg transition-all ${selectedAvatar === index ? 'bg-green-500' : 'hover:bg-green-500'}`}
                      onClick={() => setSelectedAvatar(index)}
                    >
                      <Avatar className="h-20 w-20 mx-auto rounded-lg bg-black" >
                        <AvatarImage src={generateAvatarUrl(user.username, index)} />
                        <AvatarFallback>{user.username.substring(0, 2).toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </div>
                  ))}
                </div>
                
                <AlertDialogFooter>
                  <AlertDialogCancel>Отмена</AlertDialogCancel>
                  <AlertDialogAction onClick={setNewAvatar}>Сохранить</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
            </div>            
        </>
    )
}