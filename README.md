# OPA-Dashboard

The Open Policy Agent is an open-source, general-purpose policy engine that unifies policy enforcement across the stack. OPA [decouples](https://www.openpolicyagent.org/docs/latest/philosophy#policy-decoupling) policy decision-making from policy enforcement and application logic. At Dstny Engage, making changes to permissions in the OPA service is a cumbersome and time-consuming process that requires modifying code and deploying it. This project aims to develop a centralized dashboard for a middleware between Dstny Engage's services and the open policy agent, allowing for user-friendly policy modifications in real-time.

## Running the application
You will need to have Node installed to run this project.
1. Navigate to the project folder
` cd ./opa-dashboard/ `
2. Install the dependencies
` npm install `
3. Run the application
` npm run serve `

# Built With

<div align="center">

<img src="https://upload.wikimedia.org/wikipedia/commons/9/95/Vue.js_Logo_2.svg" alt="Vue" style="height: 60px">

<img src="https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg" alt="TypeScript" style="height: 60px">

<img src="https://upload.wikimedia.org/wikipedia/en/f/f4/Docker_logo.svg" alt="Docker" style="height: 60px">

<img src="https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" alt="Figma" style="height: 60px">

</div>

## Project Walkthrough

Types of authorization policies include:

1. Role-Based Access Control (RBAC): RBAC defines access permissions based on a user’s job function or “role”. Permissions are assigned onto roles (like “Admin” or “User”), and roles are assigned to users by the administrator. This structure allows you to easily understand who has access to what. For example, in AWS, IAM includes managed policies that assign permissions to specific roles. RBAC in IAM involves creating separate policies for each job function and attaching them to identities (i.e., IAM users, user groups).

2. Attribute-Based Access Control (ABAC): ABAC is an authorization system that defines access based on attributes associated with security principals, resources, and the environment of an access request. With ABAC, you can grant a security principal access to a resource based on attributes. For example, you can add a condition that requires an object to have a specific tag to read the object. ABAC allows for more fine-grained access control and can help reduce the number of role assignments.

The dashboard offers GUI support to configure RBAC policies in realtime

![2](https://github.com/tactful-ai/OPA-Dashboard/assets/65499354/a5690a96-d5c7-40c7-abe8-01aac133bb5b)

![3](https://github.com/tactful-ai/OPA-Dashboard/assets/65499354/c3ec8bd4-95f5-4162-a8d4-fb0569cac428)

as well as a code editor to configure any other types of policies

![4](https://github.com/tactful-ai/OPA-Dashboard/assets/65499354/eeb3f7da-436e-4d78-a714-2b747a47cdc2)

Check out the UI design on Figma [here](https://www.figma.com/file/xWXPTFcimavtrVtYV1dLF5/OPA-Dashboard?type=design&node-id=8-540&mode=design&t=GOkYiRAAgWVTQvOR-0)

