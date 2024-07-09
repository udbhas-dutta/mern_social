import Post from "./Post.jsx";
import PostSkeleton from "../skeletons/PostSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useEffect } from "react";

const Posts = ({ feedType, username, userId }) => {
	const getPostEndpoint = () => {
		switch (feedType) {
			case "forYou":
				return "/api/posts/all";
			case "following":
				return "/api/posts/following";
			case "posts":
				console.log("Username:", username); // Debug log
				return `/api/posts/user/${username}`;
			case "liked":
				console.log("UserId:", userId); // Debug log
				return `/api/posts/likes/${userId}`;
			default:
				return "/api/posts/all";
		}
	};

	const postEndpoint = getPostEndpoint();
	// console.log("Fetching from endpoint:", postEndpoint);

	const { data: posts, isLoading, refetch, isRefetching, isError, error } = useQuery({
		queryKey: ["posts", feedType],
		queryFn: async () => {
			try {
				const res = await axios.get(postEndpoint);
				if (res.status !== 200) {
					throw new Error(res.data.error || "Something went wrong");
				}
				// console.log("Fetched posts:", res.data);
				return res.data;
			} catch (error) {
				console.error("Error fetching posts:", error);
				throw new Error(error.message || "Error fetching posts");
			}
		},
	});

	useEffect(() => {
		refetch();
	}, [feedType, refetch]);

	if (isLoading || isRefetching) {
		return (
			<div className='flex flex-col justify-center'>
				<PostSkeleton />
				<PostSkeleton />
				<PostSkeleton />
			</div>
		);
	}

	if (isError) {
		return <p className='text-center my-4'>Error: {error.message}</p>;
	}

	if (posts?.length === 0) {
		return <p className='text-center my-4'>No posts in this tab. Switch 👻</p>;
	}

	return (
		<div>
			{posts?.map((post) => (
				<Post key={post._id} post={post} />
			))}
		</div>
	);
};

export default Posts;
