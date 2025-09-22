"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GameSearchBar } from "@/components/GameSearchBar";
import { createMatch } from "./actions";
import { DatePicker } from "@/components/DatePicker";


export default function ClientMatchForm() {
  const [selectedGame, setSelectedGame] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);
  return (
    <form action={createMatch} className="space-y-4">
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nome partita</label>
        <Input type="text" id="name" name="name" required className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
      </div>
      <div>
        <GameSearchBar onSelect={setSelectedGame} />
        <input type="hidden" name="game" value={selectedGame} />
      </div>
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Descrizione</label>
        <Textarea id="description" name="description" className="focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-800 dark:text-gray-100 dark:border-gray-700" />
      </div>
      <div className="flex gap-4">
        <div className="w-1/2">
          <label htmlFor="startAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data inizio</label>
          <DatePicker onSelect={setSelectedDate} />
          <input
            type="hidden"
            name="endAt"
            value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
          />
        </div>
        <div className="w-1/2">
          <label htmlFor="endAt" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Data fine</label>
          <DatePicker onSelect={setSelectedDate} />
          <input
            type="hidden"
            name="endAt"
            value={selectedDate ? selectedDate.toISOString().slice(0, 10) : ""}
          />
        </div>
      </div>
      <div className="flex items-center justify-center mt-6">
        <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-700 dark:hover:bg-indigo-800 text-white font-semibold py-2 rounded-lg transition-all shadow-md">Crea partita</Button>
      </div>
    </form>
  );
}
