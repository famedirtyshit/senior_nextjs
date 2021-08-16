export default function BaseButton(prop) {

    const checkFill = () => {
        if(prop.fill == true){
            let resultClass = ' py-2 px-5 bg-' + prop.fillColor;     
            return resultClass;       
        }else{
            return "";
        }
    }

    const checkRound = () => {
        if(prop.round == true){
            let resultClass = ' rounded-' + prop.roundSize;
            return resultClass;
        }else{
            return "";
        }
    }

    const checkCustom = () => {
        if(prop.customClass){
            return " " + prop.customClass;
        }else{
            return "";
        }
    }

    const checkTextColor = () => {
        if(prop.textColor){
            return " text-" + prop.textColor;
        }else{
            return "";
        }
    }

    return (
        <button className={"2xl:text-2xl 2xl:font-normal" + checkFill() + checkRound() + checkTextColor() + checkCustom()}>{prop.value}</button>
    )
}
