import React from "react";


export const Tile = (props) => {
    let background;
    if(props.visible || (props.tile.opened == true)) {
        background = props.tile.color;
    } else {
        background = "";
    }

    let style = {
        width: props.WH,
        height: props.WH,
        background,
    }
    return (
        <div className="tiles"
             style={style}
             onClick={() => props.tileHandler(props.tile.id)}
        ></div>
    )
}