import { makeMotobug } from "../entities/motobug";
import { makeSonic } from "../entities/sonic";
import { spindash } from '../entities/sonic';
import { makeRing } from "../entities/ring";
import k from "../kaplayCtx";

export let score = 0;
export default function game(){

    score = 0;

    k.setGravity(3100);

    let rings = 0;

    let airtime = 0;

    let scoremultiplier = 1;

    let scoreText = k.add([
        k.text("SCORE : 0", { font: "mania", size: 72}),
        k.pos(20, 20),
    ]);
    let speedText = k.add([
        k.text(`SPEED : 2000MPH`, { font: "mania", size: 72}),
        k.pos(20, 100),
    ]);
    let ringsText = k.add([
        k.text(`RINGS : 0`, { font: "mania", size: 72}),
        k.pos(20, 180),
    ]);
    let airtimeText = k.add([
        k.text(`Air Combo : `, { font: "mania", size: 32}),
        k.pos(1200, 20),
    ]);
    

    let gameSpeed = 2000;
    k.loop(1, () => {
        gameSpeed += 50;
        scoremultiplier += 1;
        score += ((5 + rings) * scoremultiplier);
        if(airtime > 0){
            score += ((5 + rings) * scoremultiplier * airtime);
        };
        scoreText.text = `SCORE : ${score}`;
        speedText.text = `SPEED : ${gameSpeed}MPH`;
        console.log(gameSpeed);
        if(gameSpeed < 2000){
            scoremultiplier = 1;
        };
        if(gameSpeed >= 10000){
            console.log(gameSpeed);
            gameSpeed = 10000;
            scoremultiplier += 100;
            speedText.text = `SPEED : SUPER SONIC SPEED!!!`;
        };
        if(gameSpeed <= 0){
            k.go("main-menu");
        };
    });

    const sonic = makeSonic(k.vec2(200, 745));
    sonic.setControls();
    sonic.setEvents();
    sonic.spinDash();
    sonic.onCollide("ring", (ringintheair) => {
        k.destroy(ringintheair);
        k.play("hyper-ring", {volume: 0.5});
        score += (10 * scoremultiplier);
        if(airtime > 0){
            score += (10 * scoremultiplier * airtime);
        };
        rings += 1;
        ringsText.text = `RINGS : ${rings}`;
        scoreText.text = `SCORE : ${score}`;
    });
    k.add([
        k.rect(1920, 300),
        k.opacity(0),
        k.area(),
        k.pos(0, 832),
        k.body({ isStatic: true }),
    ]);

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

    const platformsWidth = 1280;
    const platforms =[
        k.add([k.sprite("platforms"), k.pos(0, 450), k.scale(4)]),
        k.add([k.sprite("platforms"), k.pos(platformsWidth * +4, 450), k.scale(4)])
    ];

    const spawnMotoBug = () => {
        const motobug = makeMotobug(k.vec2(1950, 773));
        motobug.onUpdate(() => {
            if(gameSpeed < 3000){
                motobug.move(-(gameSpeed + 300), 0);
                return;
            };

            motobug.move(-gameSpeed, 0);
        });

        motobug.onExitScreen(() => {
            if(motobug.pos.x < 0) k.destroy(motobug);
        });

        const waitTime = k.rand(0.5, 2);
        k.wait(waitTime, spawnMotoBug);
    };
    spawnMotoBug();

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

    k.onUpdate(() => {
            if (bgPieces[1].pos.x < 0) {
                bgPieces[0].moveTo(bgPieces[1].pos.x + bgPieceWidth * 2, 0);
                bgPieces.push(bgPieces.shift());
            };
            bgPieces[0].move(-100, 0);
            bgPieces[1].moveTo(bgPieces[0].pos.x + bgPieceWidth * 2, 0);
            if (platforms[1].pos.x < 0) {
                platforms[0].moveTo(platforms[1].pos.x + platformsWidth * 4, 450);
                platforms.push(platforms.shift());
            };
            platforms[0].move(-gameSpeed, 0);
            platforms[1].moveTo(platforms[0].pos.x + platformsWidth * 4, 450);
    });
    sonic.onCollide("enemy", (enemy) => {
        if(!sonic.isGrounded()){
            k.play("destroy", {volume: 0.5});
            k.destroy(enemy);
            sonic.play("jump");
            sonic.jump();
            airtime += 1;
            gameSpeed += 100 * airtime;
            score += ((50 + rings) * scoremultiplier);
            if(airtime > 0){
                score += ((50 + rings) * scoremultiplier * airtime);
            };
            scoreText.text = `SCORE : ${score}`;
            airtimeText.text = `Air Combo : X ${airtime}`;
            return;
        };
        if(spindash){
            k.play("destroy", {volume: 0.5});
            k.destroy(enemy);
            gameSpeed -= 10;
            score += ((25 + rings) * scoremultiplier);
            if(airtime > 0){
                score += ((25 + rings) * scoremultiplier * airtime);
            };
            scoreText.text = `SCORE : ${score}`;
            return;
        };
        k.play("hurt", { volume: 0.5 });
        gameSpeed -= 300;
        rings -= 70;
        if(rings <= 0){
            rings = 0;
        };
        ringsText.text = `RINGS : ${rings}`;
        if(sonic.isGrounded()){
            airtime = 0;
            airtimeText.text = `Air Combo : `;
        };
    });
};