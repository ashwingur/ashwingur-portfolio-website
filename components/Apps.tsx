import Link from "next/link";
import React from "react";

const Apps = () => {
  return (
    <div id="apps" className="pt-20 flex flex-col items-center">
      <h1 className="text-center mb-4">Apps</h1>
      <div className="flex flex-col md:grid grid-cols-3 md:gap-6">
        <Link
          href="/MediaReviews"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Media Reviews</button>
        </Link>
        <Link
          href="/Weather"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>My Weather Station</button>
        </Link>
        <Link
          href="/NSWCarPark"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>NSW Live Car Park</button>
        </Link>
        <Link
          href="/ClashOfClans"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Clash of Clans</button>
        </Link>
        <Link
          href="/CubeTimer"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Cube Timer</button>
        </Link>
        <Link
          href="/Diskord"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Diskord</button>
        </Link>
        <Link
          href="/TicTacToe"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Tic Tac Toe</button>
        </Link>
        <Link
          href="/GenerativeArt"
          className="bg-sky-200 dark:bg-[#2e1065] hover:bg-blue-400 dark:hover:bg-violet-800 rounded-lg py-3 px-4 font-bold mx-auto my-4 transition-all w-48 text-center"
        >
          <button>Generative Art</button>
        </Link>
      </div>
    </div>
  );
};

export default Apps;
