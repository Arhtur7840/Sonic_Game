import k from "../kaplayCtx";

export let spindash = false;
export let canJump = true;
export function makeSonic(pos){
    const sonic = k.add([
        k.sprite("sonic", { anim: "run" }),
        k.scale(4),
        k.area(),
        k.anchor("center"),
        k.pos(pos),
        k.body({jumpForce: 1700}),
        {
            setControls() {
                k.onButtonPress("jump", () => {
                    if(this.isGrounded() && canJump === true) {
                        this.play("jump");
                        this.jump();
                        k.play("jump", {volume: 0.5});
                    }
                })
            },
            spinDash() {
                k.onButtonPress("spindash", () => {
                    this.play("jump");
                    canJump = false;
                    spindash = true;
                    k.play("spindash");
                });
                k.onButtonRelease("spindash", () => {
                    setTimeout( () => {
                        canJump = true;
                        spindash = false;
                        this.play("run");
                    }, 2500);
                });
            },
            setEvents(){ 
                this.onGround(() => {
                this.play("run");
                });
            },
        }
    ]);

    return sonic;
};
 