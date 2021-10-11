import {proxy} from 'valtio'

const theme = proxy({
    isDarkTheme: false
});

export {theme}