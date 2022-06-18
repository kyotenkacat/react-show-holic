import { createSlice } from '@reduxjs/toolkit';


const favoriteSlice = createSlice({
  name: 'favorite',
  initialState: {
    // items: [{
    //   description: "講述 1950 年代紐約曼哈頓上東城一名家庭主婦在遭遇丈夫外遇後，偶然在小酒吧的舞台上展現喜劇天份。在酒吧員工蘇西的幫助下，她是否能成功在單人喜劇界闖出一片天地？",
    //   imgUrl: "https://m.media-amazon.com/images/M/MV5BMzk2ZmFhNjMtOWM2YS00MGU4LTk3ODMtY2Q2MjU2ODA0MDg4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    //   originalTitle: "The Marvelous Mrs. Maisel",
    //   platform: 4,
    //   publishedDate: "2022-02-18",
    //   rating: 8.8,
    //   title: "漫才梅索太太",
    //   type: 2,
    //   id: 1,
    // }],
    items: [],
  },
  reducers: {
    toggleFav(state, action) {
      if (action.payload.type === 'add') {
        state.items.push({
          ...action.payload.show,
          favRating: 0,
          favComment: null,
        });
      } else {
        const matchId = state.items.findIndex((item) => item.id === action.payload.show.id);
        state.items.splice(matchId, 1);
      }
    },
    updateReview(state, action) {
      const match = state.items.find((item) => item.id === action.payload.showId);
      match.favRating = action.payload.favRating;
      match.favComment = action.payload.favComment;
    },
  },
});

export const favoriteActions = favoriteSlice.actions;

export default favoriteSlice;
