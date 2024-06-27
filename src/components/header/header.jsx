import { useContext } from "react";
import { FollowersContext } from "../../providers/followers/index.js";
import { ScoreContext } from "../../providers/score";

const getNewPrice = (currentFollowers) => {
    if (currentFollowers === 0) {
        return 50;
    } if (currentFollowers === 1) {
        return 100;
    } else {
        return Math.ceil(Math.exp(currentFollowers / 4) * 100);
    }
}

export const Header = () => {
    const { score, setScore } = useContext(ScoreContext);
    const { maxFollowers, setMaxFollowers, addFollowerPrice, setAddFollowerPrice } = useContext(FollowersContext);

    const onAddFollower = () => {
        if (score < addFollowerPrice) {
            return;
        }
        setScore(score - addFollowerPrice);
        setMaxFollowers(maxFollowers + 1);
        setAddFollowerPrice(getNewPrice(maxFollowers + 1));
    };
    
    return (
        <header>
            <div>Score: {score}</div>
            <div>Energy:</div>
            <div>
                <div>Followers: {maxFollowers}</div>
                <div onClick={onAddFollower} >Add Followers ({addFollowerPrice})</div>
            </div>
        </header>
    );
};