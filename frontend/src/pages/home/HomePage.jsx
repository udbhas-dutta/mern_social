import { useState } from "react";

import Posts from "../../components/common/Posts.jsx";
import CreatePost from "./CreatePost.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	const { data: user, isLoading, refetch, isRefetching } = useQuery({
        queryKey: ['userData'], // Added username to query key
        queryFn: async () => {
            try {
                const res = await axios.get(`/api/users/profile/robin12`);
                const data = res.data;
                if (res.status !== 200) {
                    throw new Error(data.error || "something went wrong");
                }
				// console.log("user from api: ", user)
				return data
            } catch (error) {
                throw new Error(error);
            }
        }
    });
	// console.log("user:", user)
	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10 h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts  feedType={feedType}/>
			</div>
		</>
	);
};
export default HomePage;