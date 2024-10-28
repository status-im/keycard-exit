import { FC, useEffect, useState } from "react";
import { Dimensions, FlatList, Image, StyleSheet } from "react-native"

type OperatorListProps = {
  wallet: string;
};

const  OperatorList: FC<OperatorListProps> = props => {
  const {wallet} = props;
  const [operators, setOperators] = useState([] as string[]);
  const { width, height } = Dimensions.get("window");

  const getOperators = async () => {
    //TODO: replace with HTTP get
    setOperators(["https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg", "https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg", "https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg", "https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg", "https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg", "https://ordinal-operators.s3.amazonaws.com/Alchemists/400/Autonomous_Esoteric_Alchemist.jpeg", "https://ordinal-operators.s3.amazonaws.com/Magicians/400/Unseen_Rogue_Magician.jpeg"])
  }

  useEffect(() => {
    getOperators();
  }, [wallet]);

  return (
    <FlatList style={styles.container} numColumns={2} data={operators} renderItem={({item}) => <Image src={item} style={[styles.operatorImg, {width:(width / 2) - 16, aspectRatio: 1}]}/>}/>
  )};

const styles = StyleSheet.create({
    container: {
       width: '100%',
       marginVertical: 10,
    },
    operatorImg: {
        marginHorizontal: 'auto',
        marginVertical: 10
    }
});

export default OperatorList;