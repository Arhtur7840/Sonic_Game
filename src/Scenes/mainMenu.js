import { makeSonic } from "../entities/sonic";
import { makeRing } from "../entities/ring";
import { score } from "./game";
import k from "../kaplayCtx";

export default function mainMenu() {
    k.onButtonPress("jump", () => k.go("game"));
    k.onButtonPress("spindash", () => k.go("game"));

    k.setGravity(0);

    makeSonic(k.vec2(200, 745));

    const bgPieceWidth = 1920;
    const bgPieces = [
        k.add([k.sprite("chemical-bg"), k.pos(0, 0), k.scale(2), k.opacity(0.1)]),
        k.add([
            k.sprite("chemical-bg"),
            k.pos(bgPieceWidth * 2, 0),
            k.scale(2),
            k.opacity(0.1)
        ])
    ];

    k.onUpdate(() => {
        if (bgPieces[1].pos.x < 0) {
            bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
            bgPieces.push(bgPieces.shift());
        };

        bgPieces[0].move(-100, 0);
        bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);
    });

    const platformsWidth = 1280;
    const platforms =[
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformsWidth * 4, 450), k.scale(4)])
    ];

    k.onUpdate(() => {
        if (platforms[1].pos.x < 0) {
            platforms[0].moveTo(platforms[1].pos.x + platformsWidth * 4, 450);
            platforms.push(platforms.shift());
        };

        platforms[0].move(-2000, 0);
        platforms[1].moveTo(platforms[0].pos.x + platforms[1].width * 4, 450);
    });

    k.add([k.text("use mouse buttons to continue", { font: "mania", size: 50}), k.pos(k.center())]);

    let gameSpeed = 2000;

    const spawnRing = () => {
        const ringintheair = makeRing(k.vec2(1950, 390));
        ringintheair.onUpdate(() => {
            ringintheair.move(-gameSpeed, 0);
        });
        ringintheair.onExitScreen(() => {
            if(ringintheair.pos.x < 0) k.destroy(ringintheair);
        });

        const waitTime = k.rand(0.2, 0.8);

        k.wait(waitTime, spawnRing);
    };

    spawnRing();

    k.add([k.text(`HIGHSCORE : ${score}`, { font: "mania", size: 50}), k.pos(75, 75)]);
};