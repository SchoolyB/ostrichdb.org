var relearn_search_index = [
  {
    "breadcrumb": "",
    "content": "Introduction",
    "description": "Introduction",
    "tags": [],
    "title": "Getting Started",
    "uri": "/basics/index.html"
  },
  {
    "breadcrumb": "Inner Workings of OstrichDB",
    "content": "Where to Start? Lets talk about how OstrichDB works on the backend. OstrichDB is simple in its design and implementation. Although the codebase may be a bit complex and intimidating at first, the concepts behind it are simple and easy to understand.\nOstrichDBs entry point is the main procedure in the main.odin file. This main procedure is handles the initialization of several subsystems and launch checks. Once these are completed, the main procedure will call the run procedure from the engine package.\n// src/main/main.odin main :: proc() { utils.main() // Initialize the utils module for logging and other utilities data.main() // Initialize the data module utils.log_runtime_event(\"OstrichDB Started\", \"\") fmt.printfln(utils.ostrich_art) version := transmute(string)utils.get_ost_version() fmt.printfln(\"%sVersion: %s%s%s\", utils.BOLD, utils.GREEN, version, utils.RESET) // Check if the engine has been initialized if config.OST_READ_CONFIG_VALUE(\"ENGINE_INIT\") == \"true\" { types.engine.Initialized = true utils.log_runtime_event(\"OstrichDB Engine Initialized\", \"\") } else { types.engine.Initialized = false } // Run the engine engine.run() } The engine package is the heart of OstrichDB and its responsible for handling the majority of the databases operations. The engine.run call in the main procedure performs its own series of checks and file generations before it itself makes a call to the OST_START_ENGINE procedure. If main is like getting in a car, and engine.run is putting the key in the ignition and turning it, then OST_START_ENGINE is like putting the car in drive and accelerating.\n// src/core/engine/engine.odin run :: proc() { //Check for ostrich.config file configFound := config.OST_CHECK_IF_CONFIG_FILE_EXISTS() switch (configFound) { case false: fmt.println(\"Config file not found.\\n Generating config file\") config.OST_CREATE_CONFIG_FILE() run() case: fmt.println(\"Starting OstrichDB\") result:= OST_START_ENGINE() //Putting the car in drive switch (result) { case 1: fmt.println(\"OstrichDB Engine started successfully\") break case 0: } } } A Brief Overview of OstrichDB’s Authentication System Now we are cooking with gas. Once the engine has successfully started, OstrichDB’s authentication system goes into effect. As then name states, the authentication system is responsible for authenticating users before allowing them to access data from OstrichDB’s command line. There is a whole checklist of things that this auth system does. Here is a brief rundown:\nIf an account already exists Prompt the user to enter their username and check if it exists withing OstrichDB Prompt the user to enter their password. Take that password, hash it, and compare it to the hashed password stored If the username nad passwords match, allow the user to access the command line If an account does not exist Prompt the user to create an account Take the username and password, hash the password, and store the username and hashed password Ask the user to relaunch OstrichDB for changes to take effect For more in dpeth information about the auth system take a look at the source code in Github\nThe OstrichDB Command Parser Now that we have a basic understanding of how OstrichDB starts up and authenticates users, lets talk about how it handles commnad parsing. OstrichDB’s parser is very simple and heres what it does:\nIt reads the users input from the command line It converts the input into capital letters It splits each word and spaces into a slice of strings The parser then assigns each token index to a specifc dynamic array or map depending on the placeement of the token when the user entered it Next it checks that the entered command is complete based off of the Action token(the first token entered) Lastly the parser appends tokens to a command struct and returns it to the engine. Pretty straightforward right? Here is the code for the parser in its entirety:\n// src/core/engine/parser.odin OST_PARSE_COMMAND :: proc(input: string) -\u003e types.Command { capitalInput := strings.to_upper(input) tokens := strings.split(strings.trim_space(capitalInput), \" \") cmd := types.Command { o_token = make([dynamic]string), m_token = make(map[string]string), s_token = make(map[string]string), } if len(tokens) == 0 { return cmd } cmd.a_token = strings.to_upper(tokens[0]) state := 0 current_modifier := \"\" for i := 1; i \u003c len(tokens); i += 1 { token := strings.to_upper(tokens[i]) switch state { case 0: cmd.t_token = token state = 1 case 1: if OST_IS_VALID_MODIFIER(token) { current_modifier = token state = 2 } else { append(\u0026cmd.o_token, tokens[i]) } case 2: cmd.m_token[current_modifier] = tokens[i] state = 1 } } return cmd } Now that the parser has done its job, the engine will take the return value from the parser and be passed in to the OST_EXECUTE_COMMAND procedure found in commands.odin. As the name suggests, this procedure is responsible for executing the command that the user entered. Tokens are evaluated in a switch statement that resembles a state machine. The state machine is used to determine the current state of the command and what action to take next. Here is a snippet of the OST_EXECUTE_COMMAND with only one command implemented:\n// src/core/engine/commands.odin OST_EXECUTE_COMMAND :: proc(cmd: ^types.Command) -\u003e int { //Check if the command is complete incompleteCommandErr := utils.new_err( .INCOMPLETE_COMMAND, utils.get_err_msg(.INCOMPLETE_COMMAND), #procedure, ) //Check if the command is invalid invalidCommandErr := utils.new_err( .INVALID_COMMAND, utils.get_err_msg(.INVALID_COMMAND), #procedure, ) defer delete(cmd.o_token) //Evaluate the Action token(first word in a command) given by the user switch (cmd.a_token) { //in the case of the VERSION command do the following case const.VERSION: utils.log_runtime_event(\"Used VERSION command\", \"User requested version information.\") fmt.printfln( \"Using OstrichDB Version: %s%s%s\", utils.BOLD, utils.get_ost_version(), utils.RESET, ) return 0 } For the sake of not just regurgitating code, I will not go into further details of the OST_EXECUTE_COMMAND procedure. If you understand what is happening above you will most likely be able understand to rest of the procedure. You can find it in the Github",
    "description": "Where to Start? Lets talk about how OstrichDB works on the backend. OstrichDB is simple in its design and implementation. Although the codebase may be a bit complex and intimidating at first, the concepts behind it are simple and easy to understand.\nOstrichDBs entry point is the main procedure in the main.odin file. This main procedure is handles the initialization of several subsystems and launch checks. Once these are completed, the main procedure will call the run procedure from the engine package.",
    "tags": [],
    "title": "How OstrichDB Works",
    "uri": "/advanced/inner-workings/index.html"
  },
  {
    "breadcrumb": "Getting Started",
    "content": "Note: The following instructions assume the following:\nYou have Git installed on your machine. You are running a Linux-based operating system. You have the Odin programming language installed and built on your machine. You have Odin set in your PATH environment variable. To install OstrichDB, run the following commands in your terminal:\nClone the repository: $ git clone https://github.com/Solitude-Software-Solutions/OstrichDB.git Change into OstrichDB’s src directory: $ cd your/path/to/OstrichDB/src Build and run OstrichDB: $ odin build main \u0026\u0026 ./main.bin",
    "description": "Note: The following instructions assume the following:\nYou have Git installed on your machine. You are running a Linux-based operating system. You have the Odin programming language installed and built on your machine. You have Odin set in your PATH environment variable. To install OstrichDB, run the following commands in your terminal:\nClone the repository: $ git clone https://github.com/Solitude-Software-Solutions/OstrichDB.git",
    "tags": [],
    "title": "Installation",
    "uri": "/basics/installation/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Learning OstrichDB",
    "uri": "/intermediate/index.html"
  },
  {
    "breadcrumb": "Learning OstrichDB",
    "content": "What Are Atoms In OstrichDB? Similiar to querys in SQL, commands in OstrichDB are groupings of tokens dubbed “ATOMS”. These ATOMS are given this name for two reasons:\nAtoms in our the basic building blocks of the universe as we know it. So why not give this fitting name to the basic building blocks of OstrichDB commands? The OstrichDB parser is specifically designed to parse commands based off of the ATOMS a command is provied. A.T.O.M.S Continuing with talking about the parser. ATOMS is an acronym that stands for:\nA - Action Token T - Target Token O - Object Token M - Modifier Token(s) S - Scope Modifier Token Action tokens Action Tokens are the entry point for all valid OstrichDB Commands. As the name suggests, Action tokens let the parser know what actions the user wants to perform. There are several action tokens currently implemented in OstrichDB. Some of these include:\nNEW FETCH RENAME ERASE SET Here is an example of an incomplete command with an just action token: NEW Remember, the action token is always the first token in a command.\nTarget Tokens Target Tokens are tokens that specifiy what data object or internal object the user wants to perform an action on. Target tokens are usually the second token in a command. Some examples of target tokens include:\nCOLLECTION CLUSTER RECORD Here is an example of an incomplete command with just an action and target token:\nNEW COLLECTION Object Tokens Object tokens are tokens that specify what target the user wants to perform an action on. Not all commands will have an object token. Some might have none whereas others might have multiple. Object tokens are always given by the user. If you name a collection user. The name “user” is the object token. Here is an example of a complete command with an action, target, and object token:\nNEW COLLECTION users This command is telling OstrichDB to create a new collection(databse) called “users”.\nModifier Tokens Modifier tokens can be thought of as optional tokens for some commands but required for others. Modifier tokens are used to tell the parser specific details about the command the user wants to perform. Here are some examples of modifier tokens:\nWITHIN TO Here is an example of a complete command with an action, target, object, and WITHIN \u0026 TO modifier tokens:\nRENAME CLUSTER user1 WITHIN COLLECTION users TO user2 This command is telling OstrichDB to rename the cluster “user1” within the collection “users” to “user2”.\nScope Modifier Tokens Scope modifiers are very special tokens. Technically the WITHIN token is a scope modifier token. Scope modifier tokens are used to tell the parser where the command should be executed. Most commands will not have a scope modifier token. Here is an example of a complete command with an action, target, object, and scope modifier token:\nNEW CLUSTER user1 WITHIN COLLECTION users This command is telling OstrichDB to create a new cluster called “user1” within the collection “users”.\nTo recap, ATOMS are the basic building blocks of OstrichDB commands. They are used to tell the parser what the user wants to do and where they want to do it.",
    "description": "What Are Atoms In OstrichDB? Similiar to querys in SQL, commands in OstrichDB are groupings of tokens dubbed “ATOMS”. These ATOMS are given this name for two reasons:\nAtoms in our the basic building blocks of the universe as we know it. So why not give this fitting name to the basic building blocks of OstrichDB commands? The OstrichDB parser is specifically designed to parse commands based off of the ATOMS a command is provied. A.T.O.M.S Continuing with talking about the parser. ATOMS is an acronym that stands for:",
    "tags": [],
    "title": "ATOMS",
    "uri": "/intermediate/atoms/index.html"
  },
  {
    "breadcrumb": "Getting Started",
    "content": "Buzz Words Galore When I am asked what OstrichDB is I have to recall back to an imaginary script that I keep stored in my mind. This script contains seemingly every buzzword one could use to descibe a crappy side project that they have been working on. Lets count the buzz words together. OstrichDB is a simple(0), lightweight(1), severless(2), document-based(3), JSON-esque(4), NoSQL(5), database system that is designed to be for on local machines for small projects. Thats it. That is the script. I have said it so many times that I can recite it in my sleep. But what does it all mean?\nSimple I designed OstrichDB for the purpose of creating an even easier alternative to SQLite. I was working on another side project called (Hallpass Hero)[https://github.com/SchoolyB/Hallpass-Hero]. This project used C++ to interact with a SQLite database. Generally speaking I felt like the C++ wrapper for SQLite was a bit too much for what I was trying to do and I wanted to create something that was easier to use. OstrichDB is designed to be easy to pickup, easy to use, and easy to understand. A user can perform basic CRUD operations by writing commands that look like plain english similar to how one would interact with a SQL database, but without the SQL.\nLightweight In its currents state the source code for OstrichDB is under 250kb with I can’t even tell you how many thousands of lines of code. The goal is to keep the codebase as small as possible while still providing the necessary functionality.\nServerless The current implementation of OstrichDB is a serverless architecture. This is subject to change in the future but for now the database is designed to be run on a local machine\nDocument-based Rather than storing data in tables like a traditional SQL database, OstrichDB stores data in documents called Collections. Collections themselves resemble JSON files. Speaking of JSON…\nJSON-esque Data is structured hierarchically in OstrichDB similar to how JSON is structured. Databases or Collections are made up of Clusters that are similar to JSON objects. Clusters are made up of related units of data called Records. Records resemble key-value pairs in JSON. There are several similarities between OstrichDB and other databases that uses JSON but there are also many key differences.\nNoSQL OstrichDB is a NoSQL database. The user can interact with data by entering commands from OstrichDB’s command line interface. These commands are similar to SQL commands but are indeed not SQL. Personally I feel that OstrichDB commands are constructed and executed in a more intuitive way than SQL commands.",
    "description": "Buzz Words Galore When I am asked what OstrichDB is I have to recall back to an imaginary script that I keep stored in my mind. This script contains seemingly every buzzword one could use to descibe a crappy side project that they have been working on. Lets count the buzz words together. OstrichDB is a simple(0), lightweight(1), severless(2), document-based(3), JSON-esque(4), NoSQL(5), database system that is designed to be for on local machines for small projects. Thats it. That is the script. I have said it so many times that I can recite it in my sleep. But what does it all mean?",
    "tags": [],
    "title": "Understanding OstrichDB",
    "uri": "/basics/understanding_ostrichdb/index.html"
  },
  {
    "breadcrumb": "Getting Started",
    "content": "Upon the succesful installation and running of OstrichDB, the user will be greeted with a prompt that askes them to create an admin account. Enter a username and password that you will remember!\nNote: Be sure not to use any private information in either the username or password when creating an account.\nOnce you have successfully created a password you will need to relaunch OstrichDB.\n$ ./main.bin Now you can log in with the information you provided when creating an account. Once logged in you can now access the OstrichDB command line. You will be given an indicator to the left of your terminal to signify that you are currently in an OstrichDB session. That indicator will look like this:\nOST\u003e\u003e\u003e From the command line you are now able to perform several operations. To continue learning about OstrichDB, head over to the Learning OstirchDB chapter.",
    "description": "Upon the succesful installation and running of OstrichDB, the user will be greeted with a prompt that askes them to create an admin account. Enter a username and password that you will remember!\nNote: Be sure not to use any private information in either the username or password when creating an account.\nOnce you have successfully created a password you will need to relaunch OstrichDB.\n$ ./main.bin",
    "tags": [],
    "title": "Creating An Account",
    "uri": "/basics/account/index.html"
  },
  {
    "breadcrumb": "Learning OstrichDB",
    "content": "Creating Your First Collection \u0026 Cluster Now that you have a better understanding of how commands in OstrichDB work. Lets create a collection to store some data.\nFrom your OstrichDB command line, type the following command:\nOST\u003e\u003e\u003e NEW COLLECTION my_collection This should successfully create a new collection called my_collection. In its current state you can view the collection from you file explorer. To do this\nOpen your operating system’s file explorer. Navigate to the directory where you installed OstrichDB. Open the bin directory. Open the collections directory. You should see a file called my_collection.ost. This is the file that stores the data for your collection.\nIf you open the newly created collection file you should only see about 7 lines of text. This is the metadata header that OstrichDB uses to ensure collections are properly formatted and thier data is stored correctly. DO NOT EDIT THIS FILE DIRECTLY! Doing so could cause data corruption and loss.\nNow keeping that file open, return to your OstrichDB command line and type the following command:\nOST\u003e\u003e\u003e NEW CLUSTER my_cluster WITHIN my_collection Now if you looks back to the collection file you should see a new line of text that looks something like this:\n{ cluster_name :identifier: MY_CLUSTER cluster_id :identifier: 445538880462173 }, If you are worried that you typed the cluster name incorrectly, dont worry! OstrichDB takes all user alphabetical input and converts it to uppercase for consistency. So my_cluster will always be MY_CLUSTER in the collection file.\nNow lets test something out; back in your OstrichDB command line type the following command:\nOST\u003e\u003e\u003e FETCH COLLECTION my_collection In your terminal this should display the following just like it looks in the file itself:\n{ cluster_name :identifier: MY_CLUSTER cluster_id :identifier: 445538880462173 }, Congratulations! You have successfully created your first collection and cluster in OstrichDB. But wait, theres no real data here. Lets add some data to the cluster.",
    "description": "Creating Your First Collection \u0026 Cluster Now that you have a better understanding of how commands in OstrichDB work. Lets create a collection to store some data.\nFrom your OstrichDB command line, type the following command:\nOST\u003e\u003e\u003e NEW COLLECTION my_collection This should successfully create a new collection called my_collection. In its current state you can view the collection from you file explorer. To do this",
    "tags": [],
    "title": "Creating Your First Collection \u0026 Cluster",
    "uri": "/intermediate/first_collection/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Inner Workings of OstrichDB",
    "uri": "/advanced/index.html"
  },
  {
    "breadcrumb": "Learning OstrichDB",
    "content": "Records! Now its time to create some records in your cluster. Records are the actual data that you want to store in your cluster. They work and look similar to key-value pairs in other JSON. But there are some key differences that make them unique to OstrichDB\nIf you rememebr the command for creating cluster you might think it would be NEW RECORD foo WITHIN CLUSTER bar WITHIN COLLECTION baz. but thankfully its not that complicated.\nTo create a record use the following command:\nNEW RECORD my_record OF_TYPE bool This command is telling OstrichDB that we want to create a new record called my_record and that it will be of type bool. This means that the record will only accept boolean values. If you try to insert a string or number into this record it will fail.\nAfter we execute this command we get a prompt telling use to chose a collection to insert the record into. Choose the “my_collection” collection that you created in the previous chapter. Next, we are prompted to choose a cluster to insert the record into. Choose the “my_cluster” cluster that you created in the previous chapter. If you followed the steps correctly and entered the correct information you should see a message that says something like Record my_record created successfully!. If you see this message then you have successfully created a record in OstrichDB.\nNow lets go back to our collection file and see how things look. We should see something like this:\n{ cluster_name :identifier: MY_CLUSTER cluster_id :identifier: 445538880462173 MY_RECORD :BOOL: }, If you see this then you have successfully created a record in OstrichDB. But we still dont have any data! Lets add some data to the record.\nTo add data to a record after its been created you can use the SET action token. Here is an example of how to set data in a record:\nSET RECORD my_record TO true Once again you will be prompted to choose a collection and cluster to insert the data into. Choose the same collection and cluster as before. If you followed the steps correctly you should see a message that says something like Record my_record updated successfully!. If you see this message then you have successfully added data to a record in OstrichDB. Note: Remeber that if you try to insert data that is not of the correct type into a record it will fail.\nNow you should have a better understanding of how records work in OstrichDB. In the next chapter we will cover how to query records and get data back from them.\nTry creating a few more records and adding data to them.",
    "description": "Records! Now its time to create some records in your cluster. Records are the actual data that you want to store in your cluster. They work and look similar to key-value pairs in other JSON. But there are some key differences that make them unique to OstrichDB\nIf you rememebr the command for creating cluster you might think it would be NEW RECORD foo WITHIN CLUSTER bar WITHIN COLLECTION baz. but thankfully its not that complicated.",
    "tags": [],
    "title": "Creating And Working With Records",
    "uri": "/intermediate/records/index.html"
  },
  {
    "breadcrumb": "Learning OstrichDB",
    "content": "In This Section you will learn about OstrichDB’s commands by example. Here are several examples of valid commands in OstrichDB that you can try out.\nExample 1: Creating a new collection OST\u003e\u003e\u003e NEW COLLECTION users Note: This will create a new collection called “users”.\nExample 2: Fetching a collection OST\u003e\u003e\u003e FETCH COLLECTION users Note: Output will be the contents of the “users” collection. This will be empty if no clusters have been added to the collection.\nExample 3: Renaming a collection or cluster OST\u003e\u003e\u003e RENAME COLLECTION users TO people or OST\u003e\u003e\u003e RENAME CLUSTER my_cluster WITHIN COLLECTION users TO your_cluster Note: This will rename the collection or cluster to the new name provided.\nExample 4: Erasing a collection OST\u003e\u003e\u003e ERASE COLLECTION people Note:This deletes the entire collection file so use with caution.\nExample 5: Adding a cluster to a collection OST\u003e\u003e\u003e NEW CLUSTER my_cluster TO COLLECTION people Example 6: Fetching a specfic cluster OST\u003e\u003e\u003e FETCH CLUSTER my_cluster WITHIN COLLECTION people Note: This will return the contents of the “my_cluster” cluster within the “people” collection if any.\nExample 7: Creating a new record OST\u003e\u003e\u003e NEW RECORD my_record OF_TYPE bool Note: After exectuting this command you will be prompted to choose a collection and cluster to insert the record into.\nExample 8: Setting data in a record OST\u003e\u003e\u003e SET RECORD my_record TO true Note: After exectuting this command you will be prompted to choose a collection and cluster to insert the data into.\nExample 9: Seeing the contents of a all data OST\u003e\u003e\u003e TREE Note: This will return the contents of all collections and clusters in the collections directory.\nExample 10: Seeing your past command usage OST\u003e\u003e\u003e HISTORY Example 11: Seeing general help documentation from the command line OST\u003e\u003e\u003e HELP Example 12: Seeing help documentation for a specific token OST\u003e\u003e\u003e HELP \u003cname_of_token\u003e //IMPORTANT: If you need help with a specific token use that token i.e. HELP COLLECTION Example 13: Exiting OstrichDB OST\u003e\u003e\u003e EXIT Example 14: Clearing the screen OST\u003e\u003e\u003e CLEAR Example 15: Seeing the version of OstrichDB you are using OST\u003e\u003e\u003e VERSION Example 16: Logging out of the current OstrichDB session OST\u003e\u003e\u003e LOGOUT Example 17: Entering FOCUS MODE OST\u003e\u003e\u003e FOCUS \u003ctarget\u003e \u003cname_of_target\u003e Note: Focus mode is covered more in depth here: Focus Mode\nExample 18: Exiting FOCUS MODE OST\u003e\u003e\u003e UNFOCUS",
    "description": "In This Section you will learn about OstrichDB’s commands by example. Here are several examples of valid commands in OstrichDB that you can try out.\nExample 1: Creating a new collection OST\u003e\u003e\u003e NEW COLLECTION users Note: This will create a new collection called “users”.\nExample 2: Fetching a collection OST\u003e\u003e\u003e FETCH COLLECTION users",
    "tags": [],
    "title": "Learning By Example",
    "uri": "/intermediate/examples/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Categories",
    "uri": "/categories/index.html"
  },
  {
    "breadcrumb": "",
    "content": "",
    "description": "",
    "tags": [],
    "title": "Tags",
    "uri": "/tags/index.html"
  }
]
