import React from 'react';

function Player({ player, score }) {

    const { alias, emailHash } = player;
    const defaultHref = encodeURIComponent(
        'https://storage.googleapis.com/riddles-images/riddles-avatar-solo-39.png');

    return (
        <div className="Player">
            <img
                className="player-avatar"
                src={ `https://www.gravatar.com/avatar/${emailHash}?d=${defaultHref}&s=26` }
                alt="avatar"
            />            <span className="player-alias">{ alias }</span>
            <span className="player-score">{ `$${score}` }</span>
        </div>
    );
}

export default Player;
