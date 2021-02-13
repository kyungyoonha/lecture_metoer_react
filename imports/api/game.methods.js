import { Meteor } from "meteor/meteor";
import { GameCollection } from "./game.collection";
import _ from "lodash";

Meteor.methods({
    "game.create"() {
        return GameCollection.insert({
            lastTargetId: 4,
            targets: [
                { _id: 1, x: 300, y: 300, size: 100 },
                { _id: 2, x: 500, y: 300, size: 150 },
                { _id: 3, x: 500, y: 500, size: 200 },
                { _id: 4, x: 300, y: 500, size: 300 },
            ],
        });
    },
    "game.targetHit"(gameId, targetId) {
        const game = GameCollection.findOne({ _id: gameId });
        const i = _.findIndex(game.targets, { _id: targetId });
        game.targets.splice(i, 1);

        const newTarget = {
            _id: game.lastTargetId + 1,
            x: _.random(0, 600),
            y: _.random(0, 600),
            size: _.random(100, 500),
        };
        game.targets.push(newTarget);
        game.lastTargetId = newTarget._id;

        GameCollection.update({ _id: game._id }, { $set: game });
    },
    "game.delete"() {
        GameCollection.remove({ _id: "BDZ4d6guXXjZ8T55J" });
    },
});

// 콘솔창에서 Meteor.call("game.create") 실행하면 games db생긴다.
// cmd > meteor mongo
// cmd > show collections;
// cmd > db.games.remove({}) => 삭제
//
