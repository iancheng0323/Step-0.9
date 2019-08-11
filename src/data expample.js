





//Todo Item
{
    title: 'string',
    creationTimeStamp: 1212121212 //timestamp
    description: 'stinrg' 
    creationTime: 'YYYY-MM-DD',
    dueTime: 'YYYY-MM-DD'
    status: 0 // 0 == not-done; 1==done

}

//User

{
    userName: 'sting',
    loginMethod: 'stinrg',
    registerTime: 1212121212//time stamp
    
}

// new

{
    title: '',
    description: '',
    creationTime: '',
    dueTime: '', //not-set == bacllog
    lastEditTime: '',
    status: '', // 0 == deleted, 1 == open, 2 == done, 3 == backlog
}

todoItem
--account
----todoInfo
----changeHistory

user
--users
----userInfo