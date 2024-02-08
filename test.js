function calculateGreennessOnOtherSide(gardens) {
    const n = gardens.length;
    const result = [];
  
    for (let i = 0; i < n; i++) {
      let leftMax = 0;
      let rightMax = 0;
  
      // Calculate greenness on the left side
      for (let j = 0; j < i; j++) {
        leftMax = Math.max(leftMax, gardens[j]);
      }
  
      // Calculate greenness on the right side
      for (let k = i + 1; k < n; k++) {
        rightMax = Math.max(rightMax, gardens[k]);
      }
  
      // The greenness on the other side is the maximum of leftMax and rightMax
      result.push(Math.max(leftMax, rightMax));
    }
  
    return result;
  }
  
  // Example usage
  const gardenGreenness = [2];
  const result = calculateGreennessOnOtherSide(gardenGreenness);
  console.log("Greenness on the other side for each garden:", result);
  