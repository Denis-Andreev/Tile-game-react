const SET_GAME_SETTINGS = "SET_GAME_SETTINGS";
const CREATE_TILES = "CREATE_TILES";
const FILL_TILES = "FILL_TILES";
const SHOW_TILE = "SHOW_TILE";
const HIDE_TILE = "HIDE_TILE";
const RESET_GAME = "RESET_GAME";
const SET_GAME_MESSAGE = "SET_GAME_MESSAGE";
const SET_NUMBER_OF_ATTEMPTS = "SET_NUMBER_OF_ATTEMPTS";
const SET_MOVES_COUNT = "SET_MOVES_COUNT";
const SET_CURRENT_ROUND = "SET_CURRENT_ROUND";
const RESET_SELECTED_COLOR = "RESET_SELECTED_COLOR";
const SET_PREV_TILE = "SET_PREV_TILE";

export const setGameLvlAC = (lvl) => ({type: SET_GAME_SETTINGS, lvl});
export const createTilesAC = () => ({type: CREATE_TILES});
export const fillTilesAC = () => ({type: FILL_TILES});
export const showTileAC = (tileId) => ({type: SHOW_TILE ,tileId});
export const hideTileAC = (tileId) => ({type: HIDE_TILE ,tileId});
export const resetGameAC = () => ({type: RESET_GAME});
export const setGameMessageAC = (message) => ({type: SET_GAME_MESSAGE, message});
export const setMovesCountAC = (count) => ({type: SET_MOVES_COUNT, count});
export const setNumberOfAttemptsAC = (numberOfAttempts) => ({type: SET_NUMBER_OF_ATTEMPTS, numberOfAttempts});
export const setCurrentRoundAC = (round) => ({type: SET_CURRENT_ROUND, round});
export const resetSelectedColorAC = () => ({type: RESET_SELECTED_COLOR});
export const setPrevTile = (tileId) => ({type: SET_PREV_TILE, tileId});
const initialState = {
    gameLevels: [
        {
            lvl: 1,
            lvlTitle: "Easy",
            tilesCount: 4,
        },
        {
            lvl: 2,
            lvlTitle: "Normal",
            tilesCount: 16,
        },
        {
            lvl: 3,
            lvlTitle: "Hard",
            tilesCount: 64,
        },
    ],
    gameSettings: {
        lvl: 2,
        tilesCount: 16,
    },
    tiles: null,
    movesCount: 0,
    selectedColors: [],
    gameMessage: null,
    numberOfAttempts: 8,
    currentRound: 0,
    prevTile: null,
}

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_GAME_SETTINGS: {
            let tilesCount = state.gameLevels.find(elem => {
                if (elem.lvl == action.lvl) {
                    return elem;
                }
            }).tilesCount;
            return {
                ...state,
                gameSettings: {
                    lvl: action.lvl,
                    tilesCount,
                    numberOfAttempts: tilesCount / 2
                }
            }
        }
        case CREATE_TILES: {
            let tiles = new Array(state.gameSettings.tilesCount);
            for (let index = 0; index < tiles.length; index++) {
                tiles[index] = {id: index, color: 0, opened: false}
            }
            return {
                ...state,
                tiles,
            }
        }
        case FILL_TILES: {
            // Создаем массив цветов для плиток
            let colors = new Array(state.gameSettings.tilesCount / 2);
            for (let i = 0; i < colors.length; i++) {
                colors[i] = '#' + (Math.random().toString(16) + '000000').substring(2,8).toUpperCase();
            }
            // Дублируем цвета и смешиваем массив
            colors = [...colors, ...colors].sort(() => Math.random() - 0.5);
            return {
                ...state,
                tiles: state.tiles.map((elem, index) => {
                    elem.color = colors[index]
                    return elem;
                })
            }
        }
        case SHOW_TILE: {
            let tileColor;
            return {
                ...state,
                tiles: state.tiles.filter(elem => {
                    if(elem.id === action.tileId) {
                        elem.opened = true;
                        tileColor = elem.color;
                    }
                    return elem;
                }),
                selectedColors: [...state.selectedColors, tileColor]
            }
        }
        case HIDE_TILE: {
            return {
                ...state,
                tiles: state.tiles.filter(elem => {
                    if(elem.id === action.tileId) {
                        elem.opened = false;
                    }
                    return elem;
                })
            }
        }
        case SET_PREV_TILE: {
            return {
                ...state,
                prevTile: action.tileId
            }
        }
        case SET_CURRENT_ROUND: {
            return {
                ...state,
                currentRound: action.round,
            }
        }
        case SET_NUMBER_OF_ATTEMPTS: {
            return {
                ...state,
                numberOfAttempts: action.numberOfAttempts
            }
        }
        case SET_GAME_MESSAGE: {
            return {
                ...state,
                gameMessage: action.message
            }
        }
        case RESET_SELECTED_COLOR: {
            return {
                ...state,
                selectedColors: [],
            }
        }
        case SET_MOVES_COUNT: {
            return {
                ...state,
                movesCount: action.count
            }
        }
        case RESET_GAME: {
            return {
                ...state,
                gameSettings: {
                    lvl: 2,
                    tilesCount: 16,
                },
                tiles: null,
                movesCount: 0,
                selectedColors: [],
                gameMessage: null,
                currentRound: 0,
            }
        }
        default: {
            return state;
        }
    }
}

export const startGame = () => {
    return (dispatch, getState) => {
        dispatch(createTilesAC());
        dispatch(fillTilesAC());
        dispatch(setNumberOfAttemptsAC(getState().gameSettings.tilesCount / 2))
    };
};


export const gameHandler = (tileId) => {
    return (dispatch, getState) => {
        // Получение информации о плитке на которой было совершено действие
        let tileState = getState().tiles.filter(elem => {
            if(elem.id == tileId) {
                return elem;
            }
        })[0];

        // Если плитка уже открыта, никаких обработок не будет происходить
        if (tileState.opened) {
            return;
        }

        let movesCount = getState().movesCount + 1;
        let selectedColors = getState().selectedColors;
        dispatch(setMovesCountAC(movesCount));

        if(movesCount < 3) {
            // Показываем цвет текущей плитки и заносим в массив выбранных цветов её цвет
            dispatch(showTileAC(tileId));
            selectedColors = getState().selectedColors;
            if(movesCount === 2) {
                // Если было уже выбрано 2 плитки, сравниваем массив выбранных цветов
                if (selectedColors[0] === selectedColors[1]) { // Если были выбраны две одинаковые плитки
                    if(!getState().tiles.find(elem => elem.opened == false)) { // Если нет закрытых плиток
                        // Выводим сообщение о победе и показываем количество набранных очков
                        dispatch(setGameMessageAC("You won! Your score: "+ getState().gameSettings.tilesCount*(getState().numberOfAttempts+1)))

                        // Заканчиваем игру
                        setTimeout(() => dispatch(resetGameAC()), 2000);
                    } else { // если еще есть открытые плитки
                        // Переходим к следующему раунду
                        dispatch(setGameMessageAC("Moving on to the next round!"));
                        dispatch(setCurrentRoundAC(getState().currentRound + 1));
                    }
                } else { // Если были выбраны разные плитки
                    if(!getState().numberOfAttempts) { // если у игрока закончились ходы
                        // Выводим сообщение о проигрыше и заканиваем игру
                        dispatch(setGameMessageAC("You lost!"));

                        setTimeout(() => dispatch(resetGameAC()), 2000);
                    } else { // если у игрока еще есть ходы
                        // Выводим сообщение о количестве оставшихся ходов
                        let numberOfAttempts = getState().numberOfAttempts;
                        dispatch(setGameMessageAC('Different tiles!'+(numberOfAttempts - 1)+' attempts left'))

                        // Отнимаем у игрока один ход
                        dispatch(setNumberOfAttemptsAC(numberOfAttempts - 1));
                        // Очищаем цвета открытых плиток
                        dispatch(resetSelectedColorAC())
                        // Обнуляем количество ходов
                        dispatch(setMovesCountAC(0));

                        // Переворачиваем плитки обратно через некоторое время
                        let prevTileIdAsync = getState().prevTile; // запоминаем значение предыдущей плитки чтобы ее
                        // перевернуть, так как во время переворотов ёё значение может измениться
                        setTimeout(()=> {
                            dispatch(hideTileAC(tileId));
                            dispatch(hideTileAC(prevTileIdAsync));
                        }, 1000)
                    }
                }

            }
        } else { // Если открывается третья плитка
            if (selectedColors[0] === selectedColors[1]) { // если цвета первых двух плиток одинаковые
                // обнуляем выбранные цвета
                dispatch(resetSelectedColorAC());
                // показываем третью плитку
                dispatch(showTileAC(tileId));

                dispatch(setMovesCountAC(1));

            }
        }
        // Плитка над которой производилась работа, становится предыдущей.
        dispatch(setPrevTile(tileId));
    };
};



export default rootReducer;