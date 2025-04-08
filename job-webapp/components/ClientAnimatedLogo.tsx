"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ClientAnimatedLogo() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <motion.div
      initial={{ rotate: -180, opacity: 0, scale: 0.5 }}
      animate={isLoaded ? { rotate: 0, opacity: 1, scale: 1 } : {}}
      transition={{ duration: 0.8, type: "spring", bounce: 0.5 }}
      className="relative w-10 h-10 md:w-12 md:h-12"
    >
      <Image
        src="/images/logo.svg"
        alt="Jolt Jordan Logo"
        fill
        className="object-contain"
        priority
      />
    </motion.div>
  );
}
