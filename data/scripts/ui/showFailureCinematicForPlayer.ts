import { system, type Entity, type Player, type Vector3 } from "@minecraft/server";
import {
    CHASE_CINEMATIC_CAMERA_RESTORE_TICKS,
    CHASE_CINEMATIC_FADE_IN_SECONDS,
    CHASE_CINEMATIC_FADE_OUT_SECONDS,
    CHASE_CINEMATIC_HOLD_SECONDS,
    CHASE_CINEMATIC_REVEAL_TICKS,
    CHASE_CINEMATIC_WHEEL_SPAWN_DISTANCE,
    SEARCH_SEQUENCE_WHEEL_NAME_TAG,
    SEARCH_SEQUENCE_WHEEL_TYPE_ID
} from "../config/constants";
import { getSearchWheelOwnerTagForPlayerId } from "../objective/chase/getSearchwheelOwnerTagForPlayerId";
import { startSearchSequenceForPlayer } from "../objective/chase/startSearchSequenceForPlayer";

const CAMERA_FORWARD_DIST = 5;
const CAMERA_HEIGHT_ABOVE = 3;
const DEG_PER_RAD = 180 / Math.PI;

const spawnWheelBehindPlayer = (player: Player): Entity | undefined => {
    const viewDir = player.getViewDirection();
    const horizLen = Math.sqrt(viewDir.x * viewDir.x + viewDir.z * viewDir.z);
    if (horizLen <= 0) return undefined;

    const normX = viewDir.x / horizLen;
    const normZ = viewDir.z / horizLen;

    const spawnLocation = {
        x: player.location.x - normX * CHASE_CINEMATIC_WHEEL_SPAWN_DISTANCE,
        y: player.location.y,
        z: player.location.z - normZ * CHASE_CINEMATIC_WHEEL_SPAWN_DISTANCE
    };

    const ownerTag = getSearchWheelOwnerTagForPlayerId(player.id);
    const wheel = player.dimension.spawnEntity(SEARCH_SEQUENCE_WHEEL_TYPE_ID, spawnLocation);
    if (!wheel?.isValid) return undefined;

    wheel.triggerEvent("twh:set_normal_stance");
    wheel.nameTag = SEARCH_SEQUENCE_WHEEL_NAME_TAG;
    wheel.addTag("the_wheel");
    wheel.addTag(ownerTag);

    return wheel;
};

const setCinematicCamera = (player: Player): void => {
    const loc = player.location;
    const viewDir = player.getViewDirection();
    const horizLen = Math.sqrt(viewDir.x * viewDir.x + viewDir.z * viewDir.z);
    if (horizLen <= 0) return;

    const normX = viewDir.x / horizLen;
    const normZ = viewDir.z / horizLen;

    const camX = loc.x + normX * CAMERA_FORWARD_DIST;
    const camY = loc.y + CAMERA_HEIGHT_ABOVE;
    const camZ = loc.z + normZ * CAMERA_FORWARD_DIST;

    const dx = -normX * CAMERA_FORWARD_DIST;
    const dy = 1.6 - CAMERA_HEIGHT_ABOVE;
    const dz = -normZ * CAMERA_FORWARD_DIST;

    const pitch = -Math.atan2(dy, CAMERA_FORWARD_DIST) * DEG_PER_RAD;
    const yaw = Math.atan2(-dx, dz) * DEG_PER_RAD;

    player.camera.setCamera("minecraft:free", {
        location: { x: camX, y: camY, z: camZ },
        rotation: { x: pitch, y: yaw }
    });
};

const freezePlayerInput = (player: Player): void => {
    player.inputPermissions.movementEnabled = false;
    player.inputPermissions.lateralMovementEnabled = false;
    player.inputPermissions.sneakingEnabled = false;
    player.inputPermissions.sprintingEnabled = false;
    player.inputPermissions.lookingEnabled = false;
};

const restorePlayerInput = (player: Player): void => {
    player.inputPermissions.movementEnabled = true;
    player.inputPermissions.lateralMovementEnabled = true;
    player.inputPermissions.sneakingEnabled = true;
    player.inputPermissions.sprintingEnabled = true;
    player.inputPermissions.lookingEnabled = true;
};

const freezeEntityAtLocation = (entity: Entity, location: Vector3): number => {
    return system.runInterval(() => {
        if (!entity.isValid) return;
        entity.teleport(location);
    }, 1);
};

export const showFailureCinematicForPlayer = (player: Player): void => {
    if (!player.isValid) return;

    const wheel = spawnWheelBehindPlayer(player);
    const wheelSpawnLocation = wheel?.isValid ? { ...wheel.location } : undefined;
    const playerFreezeLocation = { ...player.location };

    setCinematicCamera(player);
    freezePlayerInput(player);

    player.playSound("mob.endermen.scream", { pitch: 0.8, volume: 1.0 });

    player.onScreenDisplay.setTitle("§c§lRUN", {
        stayDuration: CHASE_CINEMATIC_REVEAL_TICKS,
        fadeInDuration: 5,
        fadeOutDuration: 5,
        subtitle: "§7The Wheel has found you."
    });

    const playerFreezeId = freezeEntityAtLocation(player, playerFreezeLocation);
    system.runTimeout(() => system.clearRun(playerFreezeId), CHASE_CINEMATIC_CAMERA_RESTORE_TICKS);

    if (wheel && wheelSpawnLocation) {
        const wheelFreezeId = freezeEntityAtLocation(wheel, wheelSpawnLocation);
        system.runTimeout(() => system.clearRun(wheelFreezeId), CHASE_CINEMATIC_CAMERA_RESTORE_TICKS);
    }

    system.runTimeout(() => {
        if (!player.isValid) return;

        player.camera.fade({
            fadeColor: { red: 0, green: 0, blue: 0 },
            fadeTime: {
                fadeInTime: CHASE_CINEMATIC_FADE_IN_SECONDS,
                holdTime: CHASE_CINEMATIC_HOLD_SECONDS,
                fadeOutTime: CHASE_CINEMATIC_FADE_OUT_SECONDS
            }
        });
    }, CHASE_CINEMATIC_REVEAL_TICKS);

    system.runTimeout(() => {
        if (!player.isValid) return;

        player.camera.clear();
        restorePlayerInput(player);
        startSearchSequenceForPlayer(player);
    }, CHASE_CINEMATIC_CAMERA_RESTORE_TICKS);
};
