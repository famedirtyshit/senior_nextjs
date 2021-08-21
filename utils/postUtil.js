import axios from 'axios';

const searchLostCat = {
    search: async () => {
        try {
            // if(sexInput==undefined){
            //     sexInput = null;
            // }
            // if(collarInput==undefined){
            //     collarInput = null;
            // }
            let res = await axios.get(process.env.API_KEY + `/searchLostCat/get/d01/null/null`)
            return res;
        } catch (e) {
            return e.response;
        }
    }
}

export default searchLostCat;