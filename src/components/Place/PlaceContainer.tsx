import { Container, FederatedPointerEvent, Point } from "pixi.js";
import { MyColor } from "../../types/MyColor";
import {  PaletteManager } from "../../managers/palette";
import { PlacePointer } from "./PlacePointer";
import { PlaceView } from "./PlaceView";
import { CooldownManager } from "../../managers/cooldown";
import { CoordinatesManager } from "../../managers/coordinates";
import { ProfileManager } from "../../managers/profile";
import { Viewport } from "pixi-viewport";
import { PlaceManager } from "../../managers/place";
import { InfoManager } from "../../managers/info";
import { ColorPickerManager } from "../../managers/picker";
import { MyFetch } from "../../types/MyFetch";
import { DragEvent } from "pixi-viewport/dist/types";
import { NotificationList } from "../Notifications/NotificationList/NotificationList";
import { NotificationsManager } from "../../managers/notifications";




export class PlaceContainer extends Container {
    private pointer = new PlacePointer();
    private place = new PlaceView();
    private isDragged = false;

    constructor(private viewport: Viewport) {
        super();


        this.setup();
    }


    public setup() {
        this.on("cant-place", this.onCantPlace.bind(this));

        this.viewport.on("drag-start", this.onDragStart.bind(this));
        this.viewport.on("drag-end", this.onDragEnd.bind(this));

        this.place.on("will-place", this.onWillPlace.bind(this));
        this.place.on("place", this.onPlace.bind(this));
        this.place.on("will-color-pick", this.onWillColorPick.bind(this));
        this.place.on("hover", this.onHover.bind(this));
        this.place.on("out", this.onOut.bind(this));
        this.addChild(this.place);

        this.addChild(this.pointer);
    }

    public onDragStart(event: DragEvent) {
        // this.cursor = "grabbing"
        // this.pointer.cursor = "pointer"
        this.isDragged = true;
    }

    public onDragEnd(event: DragEvent) {
        this.cursor = "default"
        this.isDragged = false;
    }

    public onCantPlace({ reason }: { reason: "Cooldown" | "Not logged" | "Game ended" }) {
        if (reason === "Cooldown") {
            NotificationsManager.addNotification({
                title: "Кулдаун активен",
                message: "Кулдаун еще активен",
                type: "error",
            })
        } else if (reason === "Not logged") {
            NotificationsManager.addNotification({
                title: "Необходимо авторизоваться",
                message: "Вы не вошли в дискорд аккаунт",
                type: "error",
            })
        } else if (reason === "Game ended") {
            NotificationsManager.addNotification({
                title: "Игра окончена",
                message: "Подождите до начала следующей игры",
                type: "error",
            })
        }

        this.pointer.startShake();
    }

    public onWillPlace(point: Point) {
        if (this.isDragged) {
            return 
        };

        if (CooldownManager.hasCooldown.peek()) {
            return this.emit("cant-place", { reason: "Cooldown" });
        };

        if (!ProfileManager.token.peek()) {
            return this.emit("cant-place", { reason: "Not logged" });
        };
        if (InfoManager.gameEnded.value) {
            return this.emit("cant-place", { reason: "Game ended" });
        };


        MyFetch.putPixel({
            id: PlaceManager.image.value.pointToIndex(point),
            color: PaletteManager.palette.value.selected.toHex(),
        })

        this.place.setSquare(point, PaletteManager.palette.value.selected);
    }

    public onPlace(point: Point) {
        this.pointer.hover(point);
        CooldownManager.start()
    }


    public onHover(point: Point) {
        CoordinatesManager.setCoordinates(point)
        this.pointer.hover(point)
    }

    public onOut() {
        CoordinatesManager.removeCoordinates()
        this.pointer.out()
    }

    public onWillColorPick(color: MyColor) {
        if (this.isDragged) {
            return 
        };

        ColorPickerManager.isEnabled.value = false

        PaletteManager.addAndSelect(color)
    }
}