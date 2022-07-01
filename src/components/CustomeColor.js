import { HexColorPicker } from "react-colorful";
import React, {useState} from "react";

export default function CustomeColor({currentColor,onChangeColor,...rootDOMAttributes}) {
    const [color, setColor] = useState(currentColor);
    const colorChange = (e) => {
        onChangeColor(e);
        setColor(e);
    }
    return <HexColorPicker color={color} onChange={(e) => colorChange(e)} {...rootDOMAttributes}/>;
};