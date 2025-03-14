import { Models } from 'appwrite';
import React from 'react';
import Loader from './loader';
import GridPostList from './GridPostList';

type SearchResultProps = {
  isSearchFetching: boolean;
  searchedPosts: Models.DocumentList; // Ensure the correct type
};

const SearchResult = ({ isSearchFetching, searchedPosts }: SearchResultProps) => {
  if (isSearchFetching) {
    return <Loader />;
  }

  if (searchedPosts && searchedPosts.documents.length > 0) { // Fix here
    return <GridPostList posts={searchedPosts.documents} />; // Fix here
  }

  return <p className='text-light-4 mt-10 text-center w-full'>No Results Found</p>;
};

export default SearchResult;

























// import { Models } from 'appwrite';
// import React from 'react'
// import Loader from './loader';
// import GridPostList from './GridPostList';
//  type SearchResultProps = {
//   isSearchFetching :boolean;
//   searchedPosts: Models.DocumentList[];

//  }
// const SearchResult = ({isSearchFetching,searchedPosts}:SearchResultProps) => {
//   if(isSearchFetching) {
//     return ( 
//     <Loader/>
//   )
//   }

//   if(searchedPosts&& searchedPosts.documents.length > 0) {
//      return (
//   <GridPostList posts={searchedPosts.documents}/>)
//      }
//   return (
//      <p className='text-light-4 mt-10 text-center w-full'>No Results Found</p>
//   )
// }

// export default SearchResult