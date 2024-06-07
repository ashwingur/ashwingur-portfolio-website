import { useTheme } from "next-themes";
import React, { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { FaSun, FaMoon, FaFire } from "react-icons/fa";
import { FaGun } from "react-icons/fa6";
import { MdOutlineColorLens, MdSunny } from "react-icons/md";
import clsx from "clsx";

const themes = [
  {
    name: "light",
    isDark: false,
    color: "text-yellow-500",
    icon: (additionalClasses: string) => (
      <MdSunny className={clsx(additionalClasses)} />
    ),
  },
  {
    name: "dark",
    color: "text-gray-800",
    isDark: true,
    icon: (additionalClasses: string) => (
      <FaMoon className={clsx(additionalClasses)} />
    ),
  },
  {
    name: "fire",
    color: "text-orange-500",
    isDark: false,
    icon: (additionalClasses: string) => (
      <FaFire className={clsx(additionalClasses)} />
    ),
  },
  {
    name: "cyberpunk",
    color: "text-purple-500",
    isDark: true,
    icon: (additionalClasses: string) => (
      <FaGun className={clsx(additionalClasses)} />
    ),
  },
];

const ToggleThemeButton = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const currentTheme = theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className="relative inline-block text-left">
      <Combobox value={currentTheme} onChange={setTheme}>
        <Combobox.Button className="inline-flex justify-center w-full rounded-md px-4 py-2 focus:outline-none hover:bg-background-hover transition-all">
          {themes.find((t) => t.name === currentTheme)?.icon("") ?? <FaSun />}
        </Combobox.Button>

        <Combobox.Options className="absolute mt-1 w-full bg-stone-200 shadow-lg max-h-60 rounded-md text-base ring-1 ring-black ring-opacity-5 overflow-auto focus:outline-none sm:text-sm">
          {themes.map((theme) => (
            <Combobox.Option
              key={theme.name}
              value={theme.name}
              className={({ active }) =>
                `cursor-default select-none ${
                  active ? "text-white bg-stone-800" : "text-gray-900"
                }`
              }
            >
              {({ selected, active }) => (
                <div
                  className={clsx(
                    "flex justify-center items-center hover:text-white py-2",
                    active ? "text-white" : theme.color
                  )}
                >
                  {theme.icon("w-full h-6")}
                </div>
              )}
            </Combobox.Option>
          ))}
        </Combobox.Options>
      </Combobox>
    </div>
  );
};

const isDark = (currentTheme: string): boolean => {
  return themes.find((t) => t.name === currentTheme)?.isDark ?? false;
};

export { ToggleThemeButton, isDark };
