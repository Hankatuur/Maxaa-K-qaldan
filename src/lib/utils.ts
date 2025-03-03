import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 export function formatDate(dateString: string): string {
  const currentDate: Date = new Date();
  const inputDate: Date = new Date(dateString);
  
  const timeDifference: number = currentDate.getTime() - inputDate.getTime();
  const secondsDifference: number = timeDifference / 1000;

  if (secondsDifference < 60) {
      return `${Math.floor(secondsDifference)} seconds ago`;
  } else if (secondsDifference < 3600) {
      const minutes: number = Math.floor(secondsDifference / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
  } else if (secondsDifference < 86400) {
      const hours: number = Math.floor(secondsDifference / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
  } else {
      const days: number = Math.floor(secondsDifference / 86400);
      return `${days} ${days === 1 ? 'day' : 'days'} ago`;
  }
}

export const checkIsLiked = (likeList: string[], userId: string) => {
  return likeList.includes(userId);
};