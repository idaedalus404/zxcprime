"use client";

import { useParams } from "next/navigation";
import { Tailspin } from "ldrs/react";
import "ldrs/react/Tailspin.css";
import { useTmdbDetails } from "@/hooks/fetch-details";
import { useSentinelEmbed } from "@/hooks/fetch-embed";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
export default function Embed() {
  const { params } = useParams() as { params?: string[] };
  const media_type = String(params?.[0]);
  const id = String(params?.[1]);
  const season = params?.[2] ? Number(params[2]) : undefined;
  const episode = params?.[3] ? Number(params[3]) : undefined;

  const { data: details } = useTmdbDetails(media_type, id, "en-US");

  const { data: source, isLoading } = useSentinelEmbed({
    tmdbId: id,
    media_type,
    season,
    episode,
    imdbId: details?.imdb_id,
    enabled: !!details?.imdb_id,
  });

  const backdrop = details?.backdrop_paths[0] ?? null;
  useEffect(() => {
    const host = window.location.hostname;

    let script: HTMLScriptElement | null = null;

    if (host === "zxcstream.xyz" || host.endsWith(".zxcstream.xyz")) {
      script = document.createElement("script");
      script.src =
        "https://injusticebakery.com/5c/15/e7/5c15e7185944758aafe9b32aa87f5279.js";
    } else if (host === "zxcprime.xyz" || host.endsWith(".zxcprime.xyz")) {
      script = document.createElement("script");
      script.src =
        "https://injusticebakery.com/13/0a/d5/130ad559daaa237711442437661b86a6.js";
    }

    if (!script) return;

    script.async = true;
    document.body.appendChild(script);

    return () => {
      script.remove();
    };
  }, []);
  return (
    <div className="relative w-full h-dvh bg-black overflow-hidden flex justify-center items-center">
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 z-10 flex items-center justify-center bg-black"
          >
            {backdrop && (
              <img
                src={`https://image.tmdb.org/t/p/original${backdrop}`}
                alt="backdrop"
                className="object-cover h-full  w-full opacity-30 "
              />
            )}
            <div className="absolute">
              <Tailspin size="50" stroke="7" speed="0.9" color="white" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {source?.embed && (
          <motion.iframe
            key="iframe"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            src={source.embed}
            className="h-full w-full"
            frameBorder={0}
            allowFullScreen
          />
        )}
      </AnimatePresence>
    </div>
  );
}
