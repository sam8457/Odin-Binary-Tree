
class Node {
    constructor(data, left, right) {
        this.data = data;
        this.left = left;
        this.right = right;
    }

    hasChildren() {
        if (this.left == null && this.right == null) {
            return false;
        }
        return true;
    }

    hasOneChild() {
        let hasLeftChild = this.left != null;
        let hasRightChild = this.right != null;
        // exclusive or
        if ((hasLeftChild || hasRightChild) && !(hasLeftChild && hasRightChild)) {
            return true;
        }
        return false;
    }
}

class Tree {
    root;

    constructor(array) {
        this.root = this.buildTree(array);
    }

    buildTree(arr) {
        if (arr.length < 2) {
            return null;
        }

        let sortedArr = arr.sort(function(a, b){return a - b});
        
        // find middle value, set as root
        // recursively take left sub-array, build a tree out of it, and add it as the left value of root
        // recursively right left sub-array, build a tree out of it, and add it as the right value of root
        let midIndex = parseInt(sortedArr.length / 2);
        let midValue = sortedArr[midIndex];

        let leftArr = sortedArr.slice(0, midIndex);
        let rightArr = sortedArr.slice(midIndex);

        let root = new Node(
            midValue,
            this.buildTree(leftArr),
            this.buildTree(rightArr)
        );
        
        return root;
    }

    find(val, currentNode = "first run") {
        
        if(currentNode == "first run") {
            currentNode = this.root;
        }

        if(currentNode.data == val) {
            return currentNode;
        } else if (currentNode.left != null && val < currentNode.data) {
            return this.find(val, currentNode.left);
        } else if (currentNode.right != null && val > currentNode.data){
            return this.find(val, currentNode.right);
        } else {
            return null;
        }
    }

    insert(val, currentNode = "first run") {

        if(currentNode == "first run") {
            currentNode = this.root;
        }
        
        if (currentNode.data > val && currentNode.left != null) {
            this.insert(val, currentNode.left);
        } else if (currentNode.data <= val && currentNode.right != null) { // will treat as larger if same
            this.insert(val, currentNode.right);
        } else if (currentNode.data > val && currentNode.left == null) {
            currentNode.left = new Node(val, null, null);
        } else if (currentNode.data <= val && currentNode.right == null) {
            currentNode.right = new Node(val, null, null);
        }
    }

    delete(val, currentNode = "first run", previousNode = "first run") {
        
        if(currentNode == "first run") {
            currentNode = this.root;
        }

        // value has been found
        if(currentNode.data == val) {

            if(currentNode.hasChildren()) {

                if(currentNode.hasOneChild()) {
                    if (currentNode.left != null) {
                        previousNode.left = currentNode.left;
                    } else if (currentNode.right != null) {
                        previousNode.right = currentNode.right;
                    }

                } else { // there are two children
                    
                    // find next smallest
                    let nextSmallest = currentNode.right;
                    let nextSmallestPrevious = currentNode;
                    while (nextSmallest.left != null) {
                        nextSmallestPrevious = nextSmallest;
                        nextSmallest = nextSmallest.left;
                    }

                    // delete next smallest
                    this.delete(nextSmallest.data, nextSmallest, nextSmallestPrevious);

                    // replace current value with next smallest
                    currentNode.data = nextSmallest.data;
                }

            } else { // no children
                if (previousNode.left.data == val) {
                    previousNode.left = null;
                } else if (previousNode.right.data == val) {
                    previousNode.right = null;
                }
            }

        // value has not been found, keep searching
        } else if (currentNode.left != null && val < currentNode.data) {
            this.delete(val, currentNode.left, currentNode);
        } else if (currentNode.right != null && val > currentNode.data){
            this.delete(val, currentNode.right, currentNode);
        } else {
            console.log("Value not found.")
            return null;
        }
    }

    levelOrder(func) {
        let queue = [this.root];

        while(queue.length != 0) {
            if (queue[0].left != null) {
                queue.push(queue[0].left);
            }
            if (queue[0].right != null) {
                queue.push(queue[0].right);
            }

            func(queue[0].data);

            queue.shift();
        }
    }
}

// from TOP
const prettyPrint = (node, prefix = '', isLeft = true) => {
    if (node.right !== null) {
      prettyPrint(node.right, `${prefix}${isLeft ? '│   ' : '    '}`, false);
    }
    console.log(`${prefix}${isLeft ? '└── ' : '┌── '}${node.data}`);
    if (node.left !== null) {
      prettyPrint(node.left, `${prefix}${isLeft ? '    ' : '│   '}`, true);
    }
}

let arr = [1, 7, 4, 23, 8, 9, 4, 3, 5, 7, 9, 67, 6345, 324];
let myTree = new Tree(arr);
console.log(myTree);
prettyPrint(myTree.root);
console.log(myTree.find(3));
// console.log(myTree.find(22));
myTree.insert(27);
myTree.insert(345);
myTree.delete(67);
prettyPrint(myTree.root);
myTree.delete(999);
myTree.delete(23);
myTree.delete(27);
prettyPrint(myTree.root);
myTree.levelOrder(x => console.log(x));