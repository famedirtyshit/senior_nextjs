import Checkbox from '@material-ui/core/Checkbox';

export default function BaseCheckBox(prop) {
    return (
        <Checkbox
            checked={prop.checkValue}
            onChange={prop.setValue}
            color="primary"
            inputProps={{ 'aria-label': `${prop.label} checkbox` }}
        />
    )
}