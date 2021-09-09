import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Paper from '@material-ui/core/Paper';
import Draggable from 'react-draggable';
import { createTheme, ThemeProvider } from '@material-ui/core/styles';

const theme = createTheme({
    palette: {
        primary: {
            light: "#356053",
            main: "#356053",
            dark: "#356053",
            contrastText: "#fff",
        },
        secondary: {
            light: "#F94848",
            main: "#F94848",
            dark: "#F94848",
            contrastText: "#fff",
        },
    },
})


function PaperComponent(props) {
    return (
        <Draggable handle="#draggable-dialog-title" cancel={'[class*="MuiDialogContent-root"]'}>
            <Paper {...props} />
        </Draggable>
    );
}

export default function BaseConfirmation(prop) {

    const confirm = () => {
        prop.confirmAction();
        prop.closeConfirmation();
    }

    return (
        <div>
            <Dialog
                open={prop.confirmationStatus}
                onClose={prop.closeConfirmation}
                PaperComponent={PaperComponent}
                aria-labelledby="draggable-dialog-title"
            >
                <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title">
                    {prop.title}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {prop.content}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <ThemeProvider theme={theme}>
                        {
                            prop.confirmOnly == true
                                ?
                                null
                                :
                                <Button autoFocus onClick={prop.closeConfirmation} color="primary">
                                    Cancel
                                </Button>
                        }
                        <Button onClick={confirm} color="secondary">
                            Confirm
                        </Button>
                    </ThemeProvider>
                </DialogActions>
            </Dialog>
        </div>
    );
}