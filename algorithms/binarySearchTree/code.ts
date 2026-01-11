
export default `struct Node {
    int data;
    struct Node *left, *right;
};

struct Node* newNode(int item) {
    struct Node* temp = (struct Node*)malloc(sizeof(struct Node));
    temp->data = item;
    temp->left = temp->right = NULL;
    return temp;
}

struct Node* insert(struct Node* node, int data) {
    // If the tree is empty, return a new node
    if (node == NULL)
        return newNode(data);

    // Otherwise, recur down the tree
    if (data < node->data)
        node->left = insert(node->left, data);
    else if (data > node->data)
        node->right = insert(node->right, data);

    // Return the (unchanged) node pointer
    return node;
}

// In main():
// root = insert(root, 50);
// insert(root, 30);
// ...
`;
