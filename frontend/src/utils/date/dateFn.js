export const formatPostDate = (createdAt) => {
    const currentDate = new Date()
    const createdAtDate = new Date(createdAt)

    const timeDiffInSeconds = Math.floor((currentDate - createdAtDate) / 1000)
    const timeDiffInMinutes = Math.floor((timeDiffInSeconds) / 60)
    const timeDiffInHours = Math.floor((timeDiffInMinutes) / 60)
    const timeDiffInDays = Math.floor((timeDiffInHours) / 24)

    if (timeDiffInDays > 1) {
        return createdAtDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    } else if (timeDiffInDays === 1) {
        return "1d"
    } else if (timeDiffInHours >= 1) {
        return `${timeDiffInHours}h`
    } else if (timeDiffInMinutes >= 1) {
        return `${timeDiffInMinutes}m`
    } else if
        (timeDiffInDays === 1) {
        return "Just now";
    }
}

export const formatMemberSinceDate = (createdAt) => {
    const date = new Date(createdAt)
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
    ]
    const month = months[date.getMonth()]
    const year = date.getFullYear()
    return `Joined ${month} ${year}`
}