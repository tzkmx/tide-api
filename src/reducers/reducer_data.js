import {
    ACTION_PREFIX, STATE_ACTION_SET,
    STATE_ACTION_APPEND, STATE_ACTION_SEARCH_N_DELETE,
    STATE_ACTION_SEARCH_N_REPLACE, STATE_ACTION_SET_SINGLE, STATE_ACTION_CLEAR
}
    from "../constants_api";

export default function dataReducer (state, action){

    const result = action.payload;
    const apiAction = action.type.substr(ACTION_PREFIX.length);

    if( apiAction === STATE_ACTION_CLEAR ) {
        return (Object.assign(
            {},
            state,
            { [result.property]: undefined }
        ));
    }

    if( result && result.success ){

        let data = state[result.property];
        let meta = result.meta? result.meta : state[result.property+"Meta"];

        let newData;

        if( apiAction === STATE_ACTION_SET ) {
            newData = result.data;
        }

        else if( apiAction === STATE_ACTION_SET_SINGLE ) {
            newData = Object.assign({},result.data);
            if( result.data && result.data.id ){
                newData[result.data.id] = result.data;
            }
        }

        else if( apiAction === STATE_ACTION_APPEND ) {
            if (typeof data === "undefined")
                newData = [result.data];
            else if( data.constructor === Array )
                newData = [...data, result.data];
            else if( typeof data === "object" )
                newData = Object.assign( {}, data, result.data );
        }

        else if( apiAction === STATE_ACTION_SEARCH_N_DELETE){

            if ( data && data.constructor === Array ){
                newData = [];

                for(let i=0; i<data.length; i++) {
                    if (data[i].id === result.params.id) {

                        newData.push(...data.slice(i + 1));
                        break;
                    }
                    newData.push(data[i]);
                }
            }
            else{
                newData = [];
            }
        }
        else if( apiAction === STATE_ACTION_SEARCH_N_REPLACE){

            if ( data && data.constructor === Array ){
                newData = [];

                for(let i=0; i<data.length; i++) {
                    if (data[i].id === result.data.id) {
                        newData.push( result.data, ...data.slice(i + 1) );
                        break;
                    }
                    newData.push(data[i]);
                }
            }
            else{
                newData = [];
            }
        }
        else
            return state;


        return (Object.assign(
            {},
            state,
            { [result.property]: newData,
                [result.property+"Meta"]: meta }
        ));

    }

    return state;
}