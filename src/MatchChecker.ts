import GameScene from './scenes/GameScene'

export default class MatchChecker {
    private scene: GameScene

    constructor(scene: GameScene) {
        this.scene = scene
    }

    // checkMatches(): void {
    //     const matches = this.getMatches(this.scene.candyGrid as Candy[][]);

    //     if (matches.length > 0) {
    //       this.scene.removeCandyGroup(matches);
    //       this.scene.resetCandy();
    //       this.scene.fillCandy().then(() => {
    //         this.scene.candyUp();
    //         this.checkMatches();
    //       });
    //     } else {
    //       this.scene.swapCandies();
    //       this.scene.candyUp();
    //       this.scene.canMove = true;
    //     }
    //   }
}
