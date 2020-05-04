const check: string = "check";
export default (optionName: "httpOnly" | "secure"): boolean => {
  const nodeEnv: string | any = process.env.NODE_ENV;
  
  switch (optionName) {
    case "httpOnly":
      return nodeEnv != 'production' ? false : true;

    case "secure":
      return nodeEnv != 'production' ? false : true;
  }
}
