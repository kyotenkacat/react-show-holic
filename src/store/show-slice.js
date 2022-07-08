import { createSlice } from '@reduxjs/toolkit';
import { uiActions } from 'store/ui-slice';

const showSlice = createSlice({
  name: 'show',
  initialState: {
    // itemList: [
    //   {
    //     description: "講述 1950 年代紐約曼哈頓上東城一名家庭主婦在遭遇丈夫外遇後，偶然在小酒吧的舞台上展現喜劇天份。在酒吧員工蘇西的幫助下，她是否能成功在單人喜劇界闖出一片天地？",
    //     imgUrl: "https://m.media-amazon.com/images/M/MV5BMzk2ZmFhNjMtOWM2YS00MGU4LTk3ODMtY2Q2MjU2ODA0MDg4XkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_.jpg",
    //     originalTitle: "The Marvelous Mrs. Maisel",
    //     platform: 4,
    //     publishedDate: "2022-02-18",
    //     rating: 8.8,
    //     title: "漫才梅索太太",
    //     type: 2,
    //     id: 3,
    //   },
    // ],
    itemList: [],
  },
  reducers: {
    setShowList(state, action) {
      state.itemList = action.payload;
    },
    // toggleShow(state, action) {
    //   const match = find(state.itemList, ['id', action.payload.playListId]);
    //   if (action.payload.type === 'add') {
    //     match.showList.push(action.payload.show);
    //   } else {
    //     const matchShowId = findIndex(match.showList, ['id', action.payload.show.id]);
    //     match.showList.splice(matchShowId, 1);
    //   }
    // },
    // addPlayList(state, action) {
    //   state.itemList.push({
    //     // fix me 要加上使用者訊息
    //     id: Date.now(),
    //     title: action.payload.title,
    //     description: action.payload.description,
    //     showList: [],
    //   });
    // },
    // updatePlayList(state, action) {
    //   const match = find(state.itemList, ['id', action.payload.playListId]);
    //   match.title = action.payload.title;
    //   match.description = action.payload.description;
    // },
    // deletePlayList(state, action) {
    //   const matchIndex = findIndex(state.itemList, ['id', action.payload.playListId]);
    //   state.itemList.splice(matchIndex, 1);
    // },
  },
});

export const showActions = showSlice.actions;

export default showSlice;

export const getShowList = () => {
  return async (dispatch) => {
    dispatch(
      uiActions.setLoading(true)
    );

    // fix me change to firebase api

    // onValue(ref(database, `/playList/${auth.currentUser.uid}`), (snapshot) => {
    //   const playList = [];
    //   forEach(snapshot.val(), (item, showId) => {
    //     playList.push({
    //       showId,
    //       favRating: item.favRating,
    //       favComment: item.favComment,
    //     });
    //   })
    //   dispatch(
    //     favoriteActions.setItemList(playList)
    //   );
    // }, {
    //   onlyOnce: true
    // });

    const fetchShowList = async () => {
      const response = await fetch(
        'https://react-screen-holic-default-rtdb.firebaseio.com/showList.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!');
      }
      const data = await response.json();

      dispatch(
        uiActions.setLoading(false)
      );

      dispatch(
        showActions.setShowList(data)
      );
    };

    fetchShowList().catch((error) => {
      dispatch(
        uiActions.setLoading(false)
      );
    });
  };
}