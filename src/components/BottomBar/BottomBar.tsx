import { ComponentChildren } from "preact";
import styles from "./BottomBar.module.css";
import { Cooldown } from "../Cooldown/Cooldown";
import { Palette } from "../Palette/Palette/Palette";
import { Coordinates } from "../Coordinates/Coordinates";
import { NotificationList } from "../Notifications/NotificationList/NotificationList";




export function BottomBar() {
    return (
        <div className={styles.wrapper}>
            <div className={styles.coordinates}>
                <Coordinates />
            </div>

            <div className={styles.cooldown}>
                <Cooldown />
            </div>

            <div className={styles.palette}>
                <Palette />
            </div>

        </div>
    )
}