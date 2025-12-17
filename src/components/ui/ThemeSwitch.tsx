"use client";

import * as Switch from "@radix-ui/react-switch";
import { Icon } from "@iconify/react";
import { useTheme } from "@/hooks/useTheme";

export function ThemeSwitch() {
  const { isDark, setThemeByChecked } = useTheme();

  return (
    <Switch.Root
      className="relative inline-flex h-6 w-12 items-center rounded-full bg-gray-300 dark:bg-gray-700 transition-colors cursor-pointer"
      checked={isDark}
      onCheckedChange={setThemeByChecked}
      aria-label="Theme switch"
    >
      {/* Thumb */}
      <Switch.Thumb className="pointer-events-none flex h-5 w-5 items-center justify-center rounded-full bg-white shadow-md transform transition-transform data-[state=checked]:translate-x-6">
        <Icon
          icon={isDark ? "mdi:weather-night" : "mdi:white-balance-sunny"}
          width={14}
          height={14}
          color={isDark ? "#111" : "#f59e0b"}
        />
      </Switch.Thumb>
    </Switch.Root>
  );
}
