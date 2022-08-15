// this is just a fake user client, in reality it'd probably be using
// window.fetch to actually interact with the user.

// TODO: make this a real request with fetch so the signal does something
async function updateUser(user, updates, signal) {
    await new Promise(resolve => setTimeout(resolve, 1500)) // simulate a real-world wait period

    if (`${updates.tagline} ${updates.bio}`.includes('fail')) {
        return Promise.reject({ message: 'Something went wrong' })
    }

    return { ...user, ...updates }
}

export { updateUser }
