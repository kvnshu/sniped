import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, StyleSheet, FlatList, Image, TouchableOpacity, Keyboard} from 'react-native';
import PrimaryButton from './PrimaryButton';
import Ionicons from '@expo/vector-icons/Ionicons';

//HOW TO USE:
/*Fill in the following values:
 title, placeholder, onSelect, data, onExit

 onExit is called when a user presses the close button
 
 onSelect: a callback function to be called in parent file with selected item as key
 function is called once submission of autocomplete is "confirmed"

 Data is a list of potential text options with keys / ids associated. See this for an example:


 Example Call in Parent:
 const handleSelection = (selectedKey) => {
        console.log("Selected Key:", selectedKey);
        // Add more logic here as needed
    };

    return (
        <View style={{ flex: 1 }}>
            <AutocompleteInput
                title="User Search"
                placeholder="Type a user's name"
                onSelect={handleSelection}
            />
        </View>
    );

 */


const AutocompleteInput = ({ title, placeholder, onSelect, data, onExit}) => {
    const inputRef = useRef(null);
    const [value, setValue] = useState('');
    const [filteredData, setFilteredData] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null); 

    const handleScrollBegin = () => {
        Keyboard.dismiss(); // Dismiss the keyboard when scrolling begins
    };

    const handleSubmitButton = () => {
        if (selectedItem && onSelect) {
            onSelect(selectedItem.key);
        }
    };

    const handleItemPress = (item) => {
        Keyboard.dismiss(); 
        setSelectedItem(item);
    };

    useEffect(() => {
        // Optionally focus the input when the component mounts
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, []);

    useEffect(() => {
        const filtered = data.filter(item => 
            item.name.toLowerCase().startsWith(value.toLowerCase())
        );
        setFilteredData(filtered);
    }, [value, data]);

    const renderItem = ({ item }) => (
        <TouchableOpacity
            style={[styles.item, selectedItem?.key === item.key && styles.selectedItem]}
            onPress={() => handleItemPress(item)}
        >
            <Image source={{ uri: item.profilePic }} style={styles.profilePic} />
            <Text style={styles.username}>{item.name}</Text>
        </TouchableOpacity>
       
    );

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity style={styles.closeButton} onPress={onExit}>
                    <Ionicons name="close" size={35} color="#ccc" />
                </TouchableOpacity>
            </View>
            
            <TextInput
                ref={inputRef}
                style={styles.input}
                onChangeText={text => setValue(text)}
                value={value}
                placeholder={placeholder}
                placeholderTextColor="#ccc"
                autoFocus={true}
            />
            <FlatList
                keyboardShouldPersistTaps='handled'
                onScrollBeginDrag={handleScrollBegin}
                style={styles.listStyle}
                data={filteredData}
                renderItem={renderItem}
                keyExtractor={item => item.key}
            />
            {selectedItem && (
                <View style={styles.buttonContainer}>
                    <PrimaryButton title="Post Snipe" onPress={handleSubmitButton} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    selectedItem: {
        backgroundColor: '#1f1f54', // Highlight color for selected item
        color: '#1f1f54'
    },
    buttonContainer: {
        bottom: 20,
        width: '100%',
        paddingHorizontal: 20,
        zIndex: 1, // Ensure the button is above other elements
    },
    input: {
        color: '#ccc', // White text color
        width: '100%',
        padding: 0,
        marginBottom: 20,
        borderRadius: 5,
        fontSize: 22,
        fontFamily: 'Inter_600SemiBold', // Use the correct font weight
        textAlign: 'left', // Align text to the left
    },
    profilePic: {
        width: 40,
        height: 40,
        borderRadius: 10,
        marginRight: 10,
    },
    username: {
        color: '#ccc',
        marginRight: 10,
        fontSize: 18,
        fontFamily: 'Inter_600SemiBold'
    },
    container: {
        flex: 1,
        backgroundColor: '#000', // Dark background
        alignItems: 'stretch', // Stretch child components
        justifyContent: 'flex-start', // Align to top
        paddingTop: 20, // Add padding at the top
        paddingHorizontal: 20,
        width: "100%"
    },
    title: {
        color: '#fff', // Bold white text
        fontSize: 28,
        fontWeight: 'bold',
        marginBottom: 20,
        fontFamily: 'Inter_700Bold', // Use the correct font weight
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#1f1f54', // Adjust color as needed
    },
    listStyle: {
        backgroundColor: '#00001a', // Slightly different background
        borderTopEndRadius: 10,
        borderTopStartRadius: 10,
        
    }
});

export default AutocompleteInput;
