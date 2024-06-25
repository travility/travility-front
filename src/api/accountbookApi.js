import axios from 'axios';

//국가, 국기 api 
export const fetchCountryFlags = async () => {
    
      const response = await axios.get(
        'https://apis.data.go.kr/1262000/CountryFlagService2/getCountryFlagList2?serviceKey=z%2FJgcFj7mwylmN3DSWOtCJ3XE86974ujj%2F53Mfb1YbaHtY84TApx4CYY4ipu%2FLUt%2F7i7Us3aJ5FXWDFvGX3sJQ%3D%3D&numOfRows=220'
    );
    return response.data;
 };

 