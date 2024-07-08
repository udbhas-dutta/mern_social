import { Link } from "react-router-dom";
import RightPanelSkeleton from "../skeletons/RightPanelSkeleton.jsx";
import { useQuery } from "@tanstack/react-query";
import useFollow from "../hooks/useFollow.jsx";
import LoadingSpinner from "./LoadingSpinner.jsx";
import axios from "axios";

const RightPanel = () => {
	const { data: suggestedUsers, isLoading, isError, error } = useQuery({
		queryKey: ["suggestedUsers"],
		queryFn: async () => {
			const res = await axios.get("/api/users/suggested"); // Make sure the URL is correct
			if (res.status !== 200) {
				const errorData = await res.data;
				throw new Error(errorData.error || "Something went wrong");
			}
			const data = res.data;
			return data;
		}
	});

	const { follow, isPending } = useFollow();

	// console.log("Suggested Users:", suggestedUsers);
	// console.log("Error:", error);

	if (isLoading) return <div className="md:w-64 w-0"><RightPanelSkeleton /><RightPanelSkeleton /><RightPanelSkeleton /><RightPanelSkeleton /></div>;

	if (isError) return <div>Error: {error.message}</div>;

	if (!suggestedUsers || suggestedUsers.length === 0) return <div className="md:w-64 w-0">No users to suggest.</div>;

	return (
		<div className='hidden lg:block my-4 mx-2'>
			<div className='bg-[#16181C] p-4 rounded-md sticky top-2'>
				<p className='font-bold'>Who to follow</p>
				<div className='flex flex-col gap-4'>
					{suggestedUsers.map((user) => (
						<Link
							to={`/profile/${user.username}`}
							className='flex items-center justify-between gap-4'
							key={user._id}
						>
							<div className='flex gap-2 items-center'>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={user.profileImg || "/avatar-placeholder.png"} alt={`${user.fullName}'s profile`} />
									</div>
								</div>
								<div className='flex flex-col'>
									<span className='font-semibold tracking-tight truncate w-28'>
										{user.fullName}
									</span>
									<span className='text-sm text-slate-500'>@{user.username}</span>
								</div>
							</div>
							<div>
								<button
									className='btn bg-white text-black hover:bg-white hover:opacity-90 rounded-full btn-sm'
									onClick={(e) => {
										e.preventDefault();
										follow(user._id);
									}}
								>
									{isPending ? <LoadingSpinner size="sm" /> : "Follow"}
								</button>
							</div>
						</Link>
					))}
				</div>
			</div>
		</div>
	);
};
export default RightPanel;
