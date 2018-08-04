export const SET_ACCOUNT = 'SET_ACCOUNT';
export const SET_FOOD = 'SET_FOOD';
export const SET_SALES = 'SET_SALES';

export const setAccount = payload => {
    return {
        type: SET_ACCOUNT,
        payload: payload
    };
};

export const setFood = payload => {
    return {
        type: SET_FOOD,
        payload: payload
    };
};

export const setSales = payload => {
    return {
        type: SET_SALES,
        payload: payload
    };
};