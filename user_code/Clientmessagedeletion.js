async function main(message)
{
    // ignore direct messages
	if (!message.guild) 
		return;
	
		const fetchedLogs = await message.guild.fetchAuditLogs({
		limit: 1,
		type: 'MESSAGE_DELETE',
	});
	// Since we only have 1 audit log entry in this collection, we can simply grab the first one
	const deletionLog = fetchedLogs.entries.first();

	// Let's perform a coherence check here and make sure we got *something*
	if (!deletionLog) return console.log(`A message by ${message.author.tag} was deleted, but no relevant audit logs were found.`);

	// We now grab the user object of the person who deleted the message
	// Let us also grab the target of this action to double check things
	const { executor, target } = deletionLog;


	// And now we can update our output with a bit more information
	// We will also run a check to make sure the log we got was for the same author's message
	
	var server = message.guild.id
	if (target.id === message.author.id)
	{
		console.log(`A message by ${message.author.tag} was deleted by ${executor.tag} in ${server}. Message "${message}"`);
	}
	else 
	{
		console.log(`A message by ${message.author.tag} was deleted in ${server}, but we don't know by who.`);
	}
}
module.exports = { main }//, makeChannel};