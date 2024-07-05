import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const Posts = ({ feedType }) => {

	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "api/posts/following";
			default:
				return "/api/posts/all";
		}
	}

	const post_endPoint = getPostEndpoint()

	const { data: posts, isLoading, refetch, isRefetching } = useQuery({
		queryKey: ["posts"],
		queryFn: async () => {
			try {
				const res = await axios.get(post_endPoint)
				const data = res.data
				if (res.status !== 200) {
					throw new Error(data.error || "something went wrong")
				}
				return data
			} catch (error) {
				throw new Error(error)
			}
		}
	})

	useEffect(() => {
	  refetch()
	}, [feedType, refetch])
	

	return (
		<>
			{isLoading || isRefetching && (
				<div className='flex flex-col justify-center'>
					<PostSkeleton />
					<PostSkeleton />
					<PostSkeleton />
				</div>
			)}
			{!isLoading && !isRefetching && posts?.length === 0 && <p className='text-center my-4'>No posts in this tab. Switch 👻</p>}
			{!isLoading && !isRefetching && posts && (
				<div>
					{posts.map((post) => (
						<Post key={post._id} post={post} />
					))}
				</div>
			)}
		</>
	);
};
export default Posts;