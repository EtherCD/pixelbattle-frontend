import { Context, createContext } from "preact";
import { AppColor } from "../types/AppColor";
import { Signal, signal } from "@preact/signals";
import { AppImage } from "../types/AppImage";
import { Point } from "pixi.js";
import { config } from "../config";
import { MyFetch } from "../types/AppFetch";

export const PlaceManager = {
    image: signal({} as AppImage),
    async fetch() {
        const image = await MyFetch.pixels()

        PlaceManager.image.value = new AppImage(image)
    },
}


export const PlaceContext = createContext({} as typeof PlaceManager)




