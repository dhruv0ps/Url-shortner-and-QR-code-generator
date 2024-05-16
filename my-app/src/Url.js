import React, { useState } from 'react';
import shortid from 'shortid';
import './UrlShortener.css';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { ChromePicker } from 'react-color';
import { Link } from 'react-router-dom';


import { QRCodeCanvas } from 'qrcode.react';
const Url = () => {
    const [longUrl, setLongUrl] = useState('');
    const [shortUrl, setShortUrl] = useState('');
    const [isValidUrl, setIsValidUrl] = useState(true);
    const [generatedShortUrl, setgeneratedShortUrl] = useState("");
    const [qrCodeValue, setQRCodeValue] = useState('');
    const [activeTab, setActiveTab] = useState(0);
    const [longgUrl, setLonggUrl] = useState("")
    const [showColorPicker, setShowColorPicker] = useState(false); // Track color picker visibility
    const [buttonText, setButtonText] = useState("Copy URL")
    const [qrCodeColor, setQRCodeColor] = useState('#000000');
    const switchTab = (tabIndex) => {
        setActiveTab(tabIndex);
    }

    const regexPattern = /(https?:\/\/www\.|https?:\/\/|www\.)[a-zA-Z0-9]{1,}(?:\.com|\.ptc.com|\.edu|\.org|\.net|\.app|\.info|\.biz|\.name|\.mobi|\.jobs|\.travel|\.blog|\.guru|\.shop|\.club|\.online|\.tech|\.store|\.co\.in|\.co|\.co\.in|\.us|\.net\.in|\.ind\.in|\.io|\.asia|\.cc|\.xyz|\.space|\.host|\.site|\.pro|\.dev|\.in)/;
    const handleLongUrlChange = (event) => {
        setLonggUrl(event.target.value);
    };

    const handleCreateQRCode = () => {
        setQRCodeValue(longgUrl);
    };
    const handleColorChange = (color) => {
        setQRCodeColor(color.hex);
    };
    const toggleColorPicker = () => {
        setShowColorPicker(!showColorPicker);
    };
    const copyUrl = () => {
        navigator.clipboard.writeText(generatedShortUrl).then(() => {
            setButtonText("Copied");
            setTimeout(() => {
                setButtonText('Copy URL');

            }, 3000);

        });
    }

    const handleFormChange = (e) => {
        const inputValue = e.target.value;
        const inputName = e.target.name;

        if (inputName === 'longurl') {
            setLongUrl(inputValue);
            setIsValidUrl(regexPattern.test(inputValue));
        }
    };

    const generateShortUrl = async (event) => {
        event.preventDefault();

        if (isValidUrl) {
            try {
                const shortId = shortid.generate();
                const generatedShortUrl = http://localhost:8080/${shortId};
                    setgeneratedShortUrl(generatedShortUrl)
                const response = await fetch('http://localhost:8080/shortener', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ longUrl, shortUrl: shortId }),
                });

                if (!response.ok) {
                    throw new Error('Network response was not ok.');
                }

                const data = await response.json();
                setShortUrl(data.shortUrl);
            } catch (error) {
                console.error('Error:', error);
            }
        } else {
            setShortUrl('Invalid URL');
        }

    };

    return (
        <div>
            <header>
                <div className="left">Shrnk.me</div>
                <ul>
                    <li>My URLs</li>
                    <li>About us</li>
                </ul>
            </header>
            <div className="head1">What would you like to create?</div>
            <div className="tabs-container">
                <div className="tabs">
                    <div
                        className={tab ${activeTab === 0 ? 'active' : ''}}
                    onClick={() => switchTab(0)}
          >
                    Short link
                </div>
                <div
                    className={tab ${activeTab === 1 ? 'active' : ''}}
                onClick={() => switchTab(1)}
          >
                QR code
            </div>
        </div>
      </div >
    <div className={content ${activeTab === 0 ? 'active' : ''}} id="tab-content1">
        <h1>URL Shortener</h1>
        <form onSubmit={generateShortUrl}>
            <input
                type='text'
                placeholder='Enter URL'
                name='longurl'
                value={longUrl}
                onChange={handleFormChange}
            />
            <button type='submit'>Shorten URL</button>
        </form>
        <p className={url - validation ${isValidUrl ? 'valid' : 'invalid'}}>
        {isValidUrl ? 'Valid URL' : 'Invalid URL'}
    </p>

{
    generatedShortUrl && (
        <div className="shortened-url">
            <p>Shortened URL:</p>
            <a class="generated" href={generatedShortUrl} target='_blank' rel='noopener noreferrer'>
                {generatedShortUrl}


            </a>

            <CopyToClipboard class="co" text={generatedShortUrl}>
                <button onClick={copyUrl} className="border-2 border-blue-700 text-blue-500 font-medium px-5 py-2 ml-4 rounded-md" id='cp'>
                    {buttonText}
                </button>
            </CopyToClipboard>


        </div>
    )
}
</div >
    <div className={content ${activeTab === 1 ? 'active' : ''}} id="tab-content2">
        <h1>Create Qr code</h1>

        <br></br>
        <input type='text' id="qrurl" name='longUrl' value={longgUrl} placeholder='Enter the given URL' onChange={handleLongUrlChange} />
        <button id="create-qr-url" onClick={handleCreateQRCode}  >Create QR code</button>

        {qrCodeValue && <QRCodeCanvas value={qrCodeValue} fgColor={qrCodeColor} />}
        <button onClick={toggleColorPicker}>Toggle Color Picker</button>

        {showColorPicker && (
            <div>
                <ChromePicker color={qrCodeColor} onChange={handleColorChange} />
            </div>
        )}
    </div>

    
  </div >
);
};

export default Url;