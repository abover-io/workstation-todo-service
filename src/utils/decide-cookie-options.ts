export default (optionName: "httpOnly" | "secure"): boolean | any => {
  const nodeEnv: string | any = process.env.NODE_ENV;
  
  switch (optionName) {
    case "secure":
      return nodeEnv != 'production' ? false : true;
  }
}
